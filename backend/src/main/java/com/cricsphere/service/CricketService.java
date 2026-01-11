package com.cricsphere.service;

import com.cricsphere.model.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class CricketService {

    @Value("${cricapi.key}")
    private String apiKey;

    // --- API URLs ---
    private static final String BASE_URL = "https://api.cricapi.com/v1/";
    
    // Check your news provider documentation; ensure this URL is correct for your subscription
    private static final String NEWS_AGGREGATION_URL = "https://rest.cricketapi.com/rest/v2/news_aggregation/";

    private final RestTemplate restTemplate;

    // --- In-Memory Cache ---
    // volatile ensures visibility across different threads during @Scheduled updates
    private volatile CurrentMatchesResponse cachedMatches;
    private volatile SeriesListResponse cachedSeries;
    private volatile CountryListResponse cachedCountries;
    private volatile PlayerListResponse cachedPlayers;
    private volatile NewsAggregationResponse cachedNews;
    
    private final Map<String, SeriesDetailResponse> seriesDetailCache = new ConcurrentHashMap<>();

    public CricketService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    public void init() {
        log.info("🚀 Initializing CricketService: Starting cache warm-up...");
        try {
            refreshHighFrequencyData();
            refreshDailyData();
            refreshNews();
            log.info("✅ Cache warm-up completed successfully.");
        } catch (Exception e) {
            log.error("⚠️ Cache warm-up partially failed. Application will retry on next schedule: {}", e.getMessage());
        }
    }

    // --- Background Refreshers ---

    @Scheduled(fixedRate = 1200000) // Every 20 mins
    public void refreshHighFrequencyData() {
        try {
            log.info("🔄 Refreshing live matches...");
            String url = BASE_URL + "currentMatches?apikey=" + apiKey;
            this.cachedMatches = restTemplate.getForObject(url, CurrentMatchesResponse.class);
        } catch (Exception e) {
            log.error("❌ Failed to refresh live matches: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 21600000) // Every 6 hours
    public void refreshNews() {
        try {
            log.info("🔄 Refreshing cricket news...");
            // Standardizing the query param to access_token or apikey based on your provider
            String url = NEWS_AGGREGATION_URL + "?access_token=" + apiKey;
            this.cachedNews = restTemplate.getForObject(url, NewsAggregationResponse.class);
        } catch (Exception e) {
            log.error("❌ Failed to refresh news: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 86400000) // Every 24 hours
    public void refreshDailyData() {
        try {
            log.info("📅 Performing daily data refresh (Series, Players, Countries)...");
            
            this.cachedSeries = restTemplate.getForObject(BASE_URL + "series?apikey=" + apiKey, SeriesListResponse.class);
            this.cachedPlayers = restTemplate.getForObject(BASE_URL + "players?apikey=" + apiKey, PlayerListResponse.class);
            this.cachedCountries = restTemplate.getForObject(BASE_URL + "countries?apikey=" + apiKey, CountryListResponse.class);
            
            // Clear specific cache to prevent stale data and memory growth
            seriesDetailCache.clear();
            log.info("✅ Daily data refresh complete.");
        } catch (Exception e) {
            log.error("❌ Failed to refresh daily data: {}", e.getMessage());
        }
    }

    // --- Public Accessors ---

    public CurrentMatchesResponse getCurrentMatches() { return cachedMatches; }
    public SeriesListResponse getSeriesList() { return cachedSeries; }
    public CountryListResponse getCountryList() { return cachedCountries; }
    public PlayerListResponse getPlayerList() { return cachedPlayers; }
    public NewsAggregationResponse getNewsFeed() { return cachedNews; }

    public SeriesDetailResponse getSeriesDetail(String seriesId) {
        return seriesDetailCache.computeIfAbsent(seriesId, id -> {
            try {
                log.info("🌐 Fetching series detail from API for ID: {}", id);
                String url = BASE_URL + "series_info?apikey=" + apiKey + "&id=" + id;
                return restTemplate.getForObject(url, SeriesDetailResponse.class);
            } catch (Exception e) {
                log.error("❌ Error fetching series detail for ID {}: {}", id, e.getMessage());
                return null;
            }
        });
    }
}