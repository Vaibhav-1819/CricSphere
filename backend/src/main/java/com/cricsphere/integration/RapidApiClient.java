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

    // Using a simple cache. For production, consider @Cacheable or Caffeine
    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();
    
    // A pool of locks to prevent memory leaks while still deduplicating requests
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public RapidApiClient(RestTemplateBuilder restTemplateBuilder) {
        // Essential: Timeouts prevent the "Stuck Thread" problem
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String fetch(String url, long ttlMillis) {
        rotateDayIfNeeded();
        String key = "GET::" + url;

        // 1. Immediate Cache Check
        CachedResponse cached = cache.get(key);
        if (cached != null && !cached.isExpired()) {
            return cached.body;
        }

        // 2. Thread-safe Deduplication
        Object lock = locks.computeIfAbsent(key, k -> new Object());

        synchronized (lock) {
            try {
                // Double-check after acquiring lock
                cached = cache.get(key);
                if (cached != null && !cached.isExpired()) {
                    return cached.body;
                }

                // 3. Quota Guard
                if (dailyCallCount.get() >= DAILY_LIMIT) {
                    log.warn("🚨 API limit hit. Serving stale data.");
                    return (cached != null) ? cached.body : "{\"error\":\"Quota exceeded\"}";
                }

                return executeRequest(url, key, ttlMillis);

            } finally {
                // Cleanup lock to prevent map bloating
                locks.remove(key);
            }
        }
    }

    private String executeRequest(String url, String key, long ttlMillis) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", rapidApiKey);
            headers.set("x-rapidapi-host", rapidApiHost);

            log.info("📡 Requesting RapidAPI: {} (Count: {})", url, dailyCallCount.get() + 1);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), String.class
            );

            dailyCallCount.incrementAndGet();
            String body = response.getBody();
            
            if (body != null) {
                cache.put(key, new CachedResponse(body, ttlMillis));
            }
            return body;

        } catch (Exception e) {
            log.error("❌ RapidAPI Request Failed: {}", e.getMessage());
            CachedResponse lastKnown = cache.get(key);
            return (lastKnown != null) ? lastKnown.body : null;
        }
    }

    private synchronized void rotateDayIfNeeded() {
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDay)) {
            currentDay = today;
            dailyCallCount.set(0);
            log.info("🔄 Quota reset for new day: {}", today);
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