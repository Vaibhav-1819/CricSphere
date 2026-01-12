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

    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public RapidApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String fetch(String url, long ttlMillis) {
        rotateDayIfNeeded();
        String key = "GET::" + url;

        CachedResponse cached = cache.get(key);

        // 1️⃣ Serve fresh cache
        if (cached != null && !cached.isExpired()) {
            return cached.body;
        }

        // 2️⃣ Request deduplication
        Object lock = locks.computeIfAbsent(key, k -> new Object());

        synchronized (lock) {
            try {
                // Re-check after waiting
                cached = cache.get(key);
                if (cached != null && !cached.isExpired()) {
                    return cached.body;
                }

                // 3️⃣ Enforce quota INSIDE lock
                if (dailyCallCount.get() >= DAILY_LIMIT) {
                    log.warn("🚨 API limit hit. Serving stale for {}", key);
                    return cached != null ? cached.body : "{\"error\":\"Daily limit reached\"}";
                }

                HttpHeaders headers = new HttpHeaders();
                headers.set("x-rapidapi-key", rapidApiKey);
                headers.set("x-rapidapi-host", rapidApiHost);

                HttpEntity<Void> entity = new HttpEntity<>(headers);

                log.info("📡 RapidAPI call {} (#{})", url, dailyCallCount.get() + 1);

                ResponseEntity<String> response =
                        restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                dailyCallCount.incrementAndGet();

                String body = response.getBody();
                cache.put(key, new CachedResponse(body, ttlMillis));
                return body;

            } catch (Exception e) {
                log.error("❌ RapidAPI failed {}", e.getMessage());
                return cached != null ? cached.body : null;
            } finally {
                locks.remove(key);
            }
        }
    }

    private synchronized void rotateDayIfNeeded() {
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDay)) {
            log.info("🔄 Resetting quota");
            currentDay = today;
            dailyCallCount.set(0);
        }
    }

    private static class CachedResponse {
        final String body;
        final long expiresAt;

        CachedResponse(String body, long ttl) {
            this.body = body;
            this.expiresAt = System.currentTimeMillis() + ttl;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}
