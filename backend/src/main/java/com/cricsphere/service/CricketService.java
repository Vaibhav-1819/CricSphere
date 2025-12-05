package com.cricsphere.service;

import com.cricsphere.model.*;
import jakarta.annotation.PostConstruct; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CricketService {

    @Value("${cricapi.key}")
    private String apiKey;

    // --- API URLs ---
    private final String CURRENT_MATCHES_URL = "https://api.cricapi.com/v1/currentMatches?apikey=";
    private final String SERIES_LIST_URL = "https://api.cricapi.com/v1/series?apikey=";
    private final String COUNTRIES_LIST_URL = "https://api.cricapi.com/v1/countries?apikey=";
    private final String PLAYERS_LIST_URL = "https://api.cricapi.com/v1/players?apikey=";
    private final String SERIES_INFO_URL = "https://api.cricapi.com/v1/series_info?apikey=";
    private final String NEWS_AGGREGATION_URL = "https://rest.cricketapi.com/rest/v2/news_aggregation/"; 

    private final RestTemplate restTemplate;

    // --- 1. MEMORY CACHE (The Free Database) ---
    private CurrentMatchesResponse cachedMatches;
    private SeriesListResponse cachedSeries;
    private CountryListResponse cachedCountries;
    private PlayerListResponse cachedPlayers;
    private NewsAggregationResponse cachedNews;
    
    // Special Cache for Series Details to prevent duplicate lookups
    private final Map<String, SeriesDetailResponse> seriesDetailCache = new ConcurrentHashMap<>();

    public CricketService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // --- 2. INITIALIZATION (Runs once on Startup) ---
    @PostConstruct
    public void init() {
        System.out.println("Initializing Cache... (Costs ~5 Credits)");
        refreshHighFrequencyData(); // Matches
        refreshDailyData();         // Players, Series, Countries
        refreshNews();              // News
    }

    // --- 3. SCHEDULED TASKS (Background Workers) ---

    // A. High Frequency: Matches (Every 20 Minutes)
    // ADDED: initialDelay to prevent double-fetch on startup
    @Scheduled(fixedRate = 1200000, initialDelay = 1200000)
    public void refreshHighFrequencyData() {
        try {
            System.out.println("Fetching Live Matches from API...");
            String url = CURRENT_MATCHES_URL + apiKey;
            ResponseEntity<CurrentMatchesResponse> response = restTemplate.getForEntity(url, CurrentMatchesResponse.class);
            if (response.getBody() != null && "success".equalsIgnoreCase(response.getBody().getStatus())) {
                this.cachedMatches = response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error updating matches: " + e.getMessage());
        }
    }

    // B. Medium Frequency: News (Every 6 Hours)
    // ADDED: initialDelay
    @Scheduled(fixedRate = 21600000, initialDelay = 21600000)
    public void refreshNews() {
        try {
            System.out.println("Fetching News from API...");
            String url = NEWS_AGGREGATION_URL + "?access_token=" + apiKey;
            ResponseEntity<NewsAggregationResponse> response = restTemplate.getForEntity(url, NewsAggregationResponse.class);
            this.cachedNews = response.getBody();
        } catch (Exception e) {
            System.err.println("Error updating news: " + e.getMessage());
        }
    }

    // C. Low Frequency: Players, Series, Countries (Every 24 Hours)
    // ADDED: initialDelay
    @Scheduled(fixedRate = 86400000, initialDelay = 86400000)
    public void refreshDailyData() {
        try {
            System.out.println("Fetching Daily Data (Series, Players, Countries)...");
            
            // 1. Series
            ResponseEntity<SeriesListResponse> seriesResp = restTemplate.getForEntity(SERIES_LIST_URL + apiKey, SeriesListResponse.class);
            this.cachedSeries = seriesResp.getBody();

            // 2. Players
            ResponseEntity<PlayerListResponse> playerResp = restTemplate.getForEntity(PLAYERS_LIST_URL + apiKey, PlayerListResponse.class);
            this.cachedPlayers = playerResp.getBody();

            // 3. Countries
            ResponseEntity<CountryListResponse> countryResp = restTemplate.getForEntity(COUNTRIES_LIST_URL + apiKey, CountryListResponse.class);
            this.cachedCountries = countryResp.getBody();
            
            // 4. Clear the Detail Cache daily to free memory
            seriesDetailCache.clear();

        } catch (Exception e) {
            System.err.println("Error updating daily data: " + e.getMessage());
        }
    }

    // --- 4. PUBLIC METHODS (The "Zero Cost" Getters) ---

    public CurrentMatchesResponse getCurrentMatches() {
        return this.cachedMatches; 
    }

    public SeriesListResponse getSeriesList() {
        return this.cachedSeries;
    }

    public CountryListResponse getCountryList() {
        return this.cachedCountries;
    }

    public PlayerListResponse getPlayerList() {
        return this.cachedPlayers;
    }
    
    public NewsAggregationResponse getNewsFeed() {
        return this.cachedNews;
    }

    public SeriesDetailResponse getSeriesDetail(String seriesId) {
        if (seriesDetailCache.containsKey(seriesId)) {
            return seriesDetailCache.get(seriesId);
        }

        try {
            String url = SERIES_INFO_URL + apiKey + "&id=" + seriesId;
            ResponseEntity<SeriesDetailResponse> response = restTemplate.getForEntity(url, SeriesDetailResponse.class);
            
            if (response.getBody() != null) {
                seriesDetailCache.put(seriesId, response.getBody());
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error fetching series detail: " + e.getMessage());
        }
        return null;
    }
}