package com.cricsphere.integration;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
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

    /**
     * Optional fallback host.
     * If URL parsing fails, we use this.
     */
    @Value("${rapidapi.host:}")
    private String rapidApiHost;

    private final RestTemplate restTemplate;

    /* ===================== Quota ===================== */
    private static final int DAILY_LIMIT = 100;
    private LocalDate currentDay = LocalDate.now();
    private final AtomicInteger dailyCallCount = new AtomicInteger(0);

    /* ===================== Cache ===================== */
    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public RapidApiClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .requestFactory(() -> {
                    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
                    factory.setConnectTimeout((int) Duration.ofSeconds(5).toMillis());
                    factory.setReadTimeout((int) Duration.ofSeconds(12).toMillis());
                    return factory;
                })
                .build();
    }

    /**
     * Fetches data from RapidAPI with:
     * - TTL caching
     * - Quota guard (100/day)
     * - Double-checked locking (anti stampede)
     * - Stale fallback on failure
     */
    public String fetch(String url, long ttlMillis) {
        rotateDayIfNeeded();

        final String cacheKey = url;

        // 1) Return cached response if valid
        CachedResponse cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            return cached.body;
        }

        // 2) Prevent multiple threads calling same URL
        Object lock = locks.computeIfAbsent(cacheKey, k -> new Object());

        synchronized (lock) {
            // Double-check after lock
            cached = cache.get(cacheKey);
            if (cached != null && !cached.isExpired()) {
                return cached.body;
            }

            // 3) Quota check
            if (dailyCallCount.get() >= DAILY_LIMIT) {
                log.warn("🚨 RapidAPI quota limit hit ({}). Serving stale fallback for: {}", DAILY_LIMIT, url);
                return (cached != null) ? cached.body : getQuotaErrorJson();
            }

            // 4) Call API
            return executeRequest(url, cacheKey, ttlMillis);
        }
    }

    private String executeRequest(String url, String key, long ttlMillis) {
        CachedResponse stale = cache.get(key);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", rapidApiKey);

            // Auto detect host from URL (recommended)
            String host = extractHost(url);
            if (host == null || host.isBlank()) {
                host = rapidApiHost;
            }

            if (host != null && !host.isBlank()) {
                headers.set("x-rapidapi-host", host);
            }

            int callNo = dailyCallCount.get() + 1;
            log.info("📡 RapidAPI Call #{} | Host: {} | URL: {}", callNo, host, url);

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

            log.warn("⚠️ Empty response body from RapidAPI: {}", url);
            return (stale != null) ? stale.body : getErrorJson("Empty response from RapidAPI");

        } catch (HttpStatusCodeException e) {
            // This gives real RapidAPI error response JSON
            log.error("❌ RapidAPI HTTP Error {} | URL: {} | Body: {}",
                    e.getStatusCode(), url, e.getResponseBodyAsString());

            // Serve stale if possible
            if (stale != null) {
                log.warn("🔄 Serving stale cache fallback due to HTTP error for: {}", url);
                return stale.body;
            }

            return getErrorJson("RapidAPI error: " + e.getResponseBodyAsString());

        } catch (Exception e) {
            log.error("❌ RapidAPI Request Failed | URL: {} | Reason: {}", url, e.getMessage());

            if (stale != null) {
                log.warn("🔄 Serving stale cache fallback due to failure for: {}", url);
                return stale.body;
            }

            return getErrorJson("API connection failed: " + e.getMessage());
        }
    }

    private String extractHost(String url) {
        try {
            URI uri = URI.create(url);
            return uri.getHost();
        } catch (Exception ignored) {
            return null;
        }
    }

    private synchronized void rotateDayIfNeeded() {
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDay)) {
            currentDay = today;
            dailyCallCount.set(0);
            log.info("🔄 Daily RapidAPI quota reset for: {}", today);
        }
    }

    private String getQuotaErrorJson() {
        return "{\"error\":true,\"status\":429,\"message\":\"Daily RapidAPI quota exceeded. Try again tomorrow.\"}";
    }

    private String getErrorJson(String msg) {
        msg = (msg == null) ? "Unknown error" : msg.replace("\"", "\\\"");
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
