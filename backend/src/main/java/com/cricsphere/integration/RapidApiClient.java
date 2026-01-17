package com.cricsphere.integration;

import com.cricsphere.service.FirestoreCacheService;
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

    @Value("${rapidapi.host:}")
    private String rapidApiHost;

    private final RestTemplate restTemplate;
    private final FirestoreCacheService firestoreCacheService;

    /* ===================== Quota ===================== */
    private static final int DAILY_LIMIT = 100;
    private LocalDate currentDay = LocalDate.now();
    private final AtomicInteger dailyCallCount = new AtomicInteger(0);

    /* ===================== Locks (anti stampede) ===================== */
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public RapidApiClient(RestTemplateBuilder restTemplateBuilder,
                          FirestoreCacheService firestoreCacheService) {

        this.firestoreCacheService = firestoreCacheService;

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
     * Firestore-based caching + quota guard:
     * - Firestore keeps cached data even if Render sleeps
     * - If cache expired, only then call RapidAPI
     * - If RapidAPI fails, serve stale Firestore cache
     */
    public String fetch(String url, long ttlMillis) {
        rotateDayIfNeeded();

        final String cacheKey = url;

        // 1) Check Firestore cache
        FirestoreCacheService.CacheEntry cached = firestoreCacheService.get(cacheKey);
        if (cached != null && !firestoreCacheService.isExpired(cached)) {
            return cached.getBody();
        }

        // 2) Prevent multiple threads calling same URL
        Object lock = locks.computeIfAbsent(cacheKey, k -> new Object());

        synchronized (lock) {
            // Double-check cache after lock
            cached = firestoreCacheService.get(cacheKey);
            if (cached != null && !firestoreCacheService.isExpired(cached)) {
                return cached.getBody();
            }

            // 3) Quota check
            if (dailyCallCount.get() >= DAILY_LIMIT) {
                log.warn("🚨 RapidAPI quota limit hit ({}). Serving stale Firestore fallback for: {}", DAILY_LIMIT, url);
                return (cached != null) ? cached.getBody() : getQuotaErrorJson();
            }

            // 4) Call API
            return executeRequest(url, cacheKey, ttlMillis);
        }
    }

    private String executeRequest(String url, String key, long ttlMillis) {
        // stale = last Firestore cache (even if expired)
        FirestoreCacheService.CacheEntry stale = firestoreCacheService.get(key);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", rapidApiKey);

            String host = extractHost(url);
            if (host == null || host.isBlank()) host = rapidApiHost;

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

                // Save to Firestore (persistent cache)
                firestoreCacheService.set(key, body, ttlMillis);

                return body;
            }

            log.warn("⚠️ Empty response body from RapidAPI: {}", url);
            return (stale != null) ? stale.getBody() : getErrorJson("Empty response from RapidAPI");

        } catch (HttpStatusCodeException e) {
            log.error("❌ RapidAPI HTTP Error {} | URL: {} | Body: {}",
                    e.getStatusCode(), url, e.getResponseBodyAsString());

            if (stale != null) {
                log.warn("🔄 Serving stale Firestore cache fallback due to HTTP error for: {}", url);
                return stale.getBody();
            }

            return getErrorJson("RapidAPI error: " + e.getResponseBodyAsString());

        } catch (Exception e) {
            log.error("❌ RapidAPI Request Failed | URL: {} | Reason: {}", url, e.getMessage());

            if (stale != null) {
                log.warn("🔄 Serving stale Firestore cache fallback due to failure for: {}", url);
                return stale.getBody();
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
}
