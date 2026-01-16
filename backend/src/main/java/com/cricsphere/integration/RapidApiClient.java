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

    private static final int DAILY_LIMIT = 100;

    private LocalDate currentDay = LocalDate.now();
    private final AtomicInteger dailyCallCount = new AtomicInteger(0);

    // Cache stores even stale values (used as fallback)
    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();

    // Keep locks stable (no remove) to avoid race issues
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public RapidApiClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String fetch(String url, long ttlMillis) {
        rotateDayIfNeeded();

        String key = "GET::" + rapidApiHost + "::" + url;

        // 1) Cache check
        CachedResponse cached = cache.get(key);

        // If expired, remove it (prevents cache growing forever)
        if (cached != null && cached.isExpired()) {
            cache.remove(key);
            cached = null;
        }

        if (cached != null) {
            return cached.body;
        }

        // 2) Deduplicate requests per URL
        Object lock = locks.computeIfAbsent(key, k -> new Object());

        synchronized (lock) {
            // Double check after lock
            cached = cache.get(key);

            if (cached != null && cached.isExpired()) {
                cache.remove(key);
                cached = null;
            }

            if (cached != null) {
                return cached.body;
            }

            // 3) Quota Guard
            if (dailyCallCount.get() >= DAILY_LIMIT) {
                log.warn("🚨 RapidAPI daily quota hit ({}). Serving fallback.", DAILY_LIMIT);

                CachedResponse lastKnown = cache.get(key);
                if (lastKnown != null) return lastKnown.body;

                return "{\"error\":true,\"message\":\"RapidAPI quota exceeded\",\"data\":null}";
            }

            return executeRequest(url, key, ttlMillis);
        }
    }

    private String executeRequest(String url, String key, long ttlMillis) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", rapidApiKey);
            headers.set("x-rapidapi-host", rapidApiHost);

            log.info("📡 RapidAPI Request: {} (Call #{})", url, dailyCallCount.get() + 1);

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

            log.warn("⚠ RapidAPI returned empty body: {}", url);
            return "{\"error\":true,\"message\":\"Empty response from RapidAPI\",\"data\":null}";

        } catch (Exception e) {
            log.error("❌ RapidAPI Request Failed: {}", e.getMessage());

            CachedResponse lastKnown = cache.get(key);
            if (lastKnown != null) {
                log.warn("Serving stale cached data for {}", url);
                return lastKnown.body;
            }

            return "{\"error\":true,\"message\":\"RapidAPI request failed\",\"data\":null}";
        }
    }

    private synchronized void rotateDayIfNeeded() {
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDay)) {
            currentDay = today;
            dailyCallCount.set(0);
            log.info("🔄 RapidAPI quota reset for new day: {}", today);
        }
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
