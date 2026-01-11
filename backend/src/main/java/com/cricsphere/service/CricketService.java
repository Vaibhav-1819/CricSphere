package com.cricsphere.service;

import com.cricsphere.model.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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
    private final String CURRENT_MATCHES_URL = BASE_URL + "currentMatches?apikey=";
    private final String SERIES_LIST_URL = BASE_URL + "series?apikey=";
    private final String COUNTRIES_LIST_URL = BASE_URL + "countries?apikey=";
    private final String PLAYERS_LIST_URL = BASE_URL + "players?apikey=";
    private final String SERIES_INFO_URL = BASE_URL + "series_info?apikey=";
    
    // Check your news provider documentation, often the key parameter name differs
    private final String NEWS_AGGREGATION_URL = "https://rest.cricketapi.com/rest/v2/news_aggregation/";

    private final RestTemplate restTemplate;

    // --- In-Memory Cache ---
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
        log.info("Initial cache warm-up starting...");
        refreshHighFrequencyData();
        refreshDailyData();
        refreshNews();
        log.info("Cache warm-up completed.");
    }

    // --- Background Refreshers ---

    @Scheduled(fixedRate = 1200000, initialDelay = 1200000) // 20 mins
    public void refreshHighFrequencyData() {
        try {
            log.info("Refreshing live matches...");
            String url = CURRENT_MATCHES_URL + apiKey;
            this.cachedMatches = restTemplate.getForObject(url, CurrentMatchesResponse.class);
        } catch (Exception e) {
            log.error("Failed to refresh live matches: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 21600000, initialDelay = 21600000) // 6 hours
    public void refreshNews() {
        try {
            log.info("Refreshing cricket news...");
            String url = NEWS_AGGREGATION_URL + "?access_token=" + apiKey;
            this.cachedNews = restTemplate.getForObject(url, NewsAggregationResponse.class);
        } catch (Exception e) {
            log.error("Failed to refresh news: {}", e.getMessage());
        }
    }

    @Scheduled(fixedRate = 86400000, initialDelay = 86400000) // 24 hours
    public void refreshDailyData() {
        try {
            log.info("Performing daily data refresh (Series, Players, Countries)...");
            
            this.cachedSeries = restTemplate.getForObject(SERIES_LIST_URL + apiKey, SeriesListResponse.class);
            this.cachedPlayers = restTemplate.getForObject(PLAYERS_LIST_URL + apiKey, PlayerListResponse.class);
            this.cachedCountries = restTemplate.getForObject(COUNTRIES_LIST_URL + apiKey, CountryListResponse.class);
            
            // Prevent memory leaks by clearing specific series details daily
            seriesDetailCache.clear();
        } catch (Exception e) {
            log.error("Failed to refresh daily data: {}", e.getMessage());
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
                log.info("Fetching series detail from API for ID: {}", id);
                String url = SERIES_INFO_URL + apiKey + "&id=" + id;
                return restTemplate.getForObject(url, SeriesDetailResponse.class);
            } catch (Exception e) {
                log.error("Error fetching series detail: {}", e.getMessage());
                return null;
            }
        });
    }
}