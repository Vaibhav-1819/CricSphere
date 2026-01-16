package com.cricsphere.integration;

import lombok.extern.slf4j.Slf4j;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Component
public class RapidApiClient {

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.host}")
    private String rapidApiHost;

    private final RestTemplate restTemplate;

    // Quota management
    private static final int DAILY_LIMIT = 100;
    private LocalDate currentDay = LocalDate.now();
    private final AtomicInteger dailyCallCount = new AtomicInteger(0);

    // Cache stores: mapping unique URLs to their responses
    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public RapidApiClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .requestFactory(() -> {
                    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
                    factory.setConnectTimeout((int) Duration.ofSeconds(5).toMillis());
                    factory.setReadTimeout((int) Duration.ofSeconds(10).toMillis());
                    return factory;
                })
                .build();
    }

    /**
     * Optimized Fetch with Double-Checked Locking and Stale Fallback.
     */
    public String fetch(String url, long ttlMillis) {
        rotateDayIfNeeded();

        // Use the full URL as the key to distinguish between rankings formats/genders
        String cacheKey = url;

        // 1) Valid Cache Check
        CachedResponse cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            return cached.body;
        }

        // 2) Synchronized Fetch (prevents "Cache Stampede")
        Object lock = locks.computeIfAbsent(cacheKey, k -> new Object());
        synchronized (lock) {
            // Double check after acquiring lock
            cached = cache.get(cacheKey);
            if (cached != null && !cached.isExpired()) {
                return cached.body;
            }

            // 3) Quota Check
            if (dailyCallCount.get() >= DAILY_LIMIT) {
                log.warn("🚨 Quota Limit ({}) hit. Serving stale fallback for: {}", DAILY_LIMIT, url);
                return (cached != null) ? cached.body : getQuotaErrorJson();
            }

            return executeRequest(url, cacheKey, ttlMillis);
        }
    }

    private String executeRequest(String url, String key, long ttlMillis) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", rapidApiKey);
            headers.set("x-rapidapi-host", rapidApiHost);

            log.info("📡 API Call #{} | Requesting: {}", dailyCallCount.get() + 1, url);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );

            String body = response.getBody();

            if (body != null && !body.isBlank()) {
                dailyCallCount.incrementAndGet();
                cache.put(key, new CachedResponse(body, ttlMillis));
                return body;
            }

            return getErrorJson("Empty response from RapidAPI");

        } catch (Exception e) {
            log.error("❌ API Request Failed: {}", e.getMessage());
            
            // If request fails, try to return the expired cache as a fallback
            CachedResponse stale = cache.get(key);
            if (stale != null) {
                log.warn("🔄 Serving stale data as fallback for: {}", url);
                return stale.body;
            }

            return getErrorJson("API connection failed: " + e.getMessage());
        }
    }

    private synchronized void rotateDayIfNeeded() {
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDay)) {
            currentDay = today;
            dailyCallCount.set(0);
            log.info("🔄 Daily API quota reset for: {}", today);
        }
    }

    private String getQuotaErrorJson() {
        return "{\"error\":true,\"status\":429,\"message\":\"Daily API quota exceeded. Try again tomorrow.\"}";
    }

    private String getErrorJson(String msg) {
        return String.format("{\"error\":true,\"status\":500,\"message\":\"%s\"}", msg);
    }

    @Getter
    private static class CachedResponse {
        private final String body;
        private final long expiresAt;

        CachedResponse(String body, long ttl) {
            this.body = body;
            this.expiresAt = System.currentTimeMillis() + ttl;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}