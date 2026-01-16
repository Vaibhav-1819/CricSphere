package com.cricsphere.service;

import com.cricsphere.integration.RapidApiClient;
import com.cricsphere.model.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class CricketService {

    @Value("${cricapi.key}")
    private String cricApiKey;

    private static final String CRICAPI_BASE = "https://api.cricapi.com/v1/";

    /* ===================== Cricbuzz URLs ===================== */
    private static final String LIVE         = "https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/live";
    private static final String UPCOMING     = "https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/upcoming";
    private static final String RECENT       = "https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/recent";
    private static final String MATCH_INFO   = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s";
    private static final String SCORECARD    = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/scard";
    private static final String COMMENTARY   = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/comm";
    private static final String SQUADS       = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/team";
    private static final String OVERS        = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/overs";
    
    // Updated to the specific team rankings endpoint
    private static final String RANKINGS_TEAMS = "https://cricbuzz-cricket2.p.rapidapi.com/stats/v1/rankings/teams";
    
    private static final String NEWS         = "https://cricbuzz-cricket2.p.rapidapi.com/news/v1/index";
    private static final String NEWS_DETAIL  = "https://cricbuzz-cricket2.p.rapidapi.com/news/v1/detail/%s";
    private static final String TEAMS        = "https://cricbuzz-cricket2.p.rapidapi.com/teams/v1/%s";
    private static final String PLAYER       = "https://cricbuzz-cricket2.p.rapidapi.com/stats/v1/player/%s";
    private static final String VENUE        = "https://cricbuzz-cricket2.p.rapidapi.com/venue/v1/%s";

    /* ===================== TTL Constants ===================== */
    private static final long TTL_2_MIN   = 2 * 60 * 1000L;
    private static final long TTL_5_MIN   = 5 * 60 * 1000L;
    private static final long TTL_10_MIN  = 10 * 60 * 1000L;
    private static final long TTL_20_MIN  = 20 * 60 * 1000L;
    private static final long TTL_30_MIN  = 30 * 60 * 1000L;
    private static final long TTL_2_HOUR  = 2 * 60 * 60 * 1000L;
    private static final long TTL_6_HOUR  = 6 * 60 * 60 * 1000L;
    private static final long TTL_24_HOUR = 24 * 60 * 60 * 1000L;

    private final RapidApiClient rapidApi;
    private final RestTemplate restTemplate;

    /* ===================== CricAPI Cache (Reference Data) ===================== */
    private volatile SeriesListResponse cachedSeries;
    private volatile CountryListResponse cachedCountries;
    private volatile PlayerListResponse cachedPlayers;

    private final Map<String, SeriesDetailResponse> seriesDetailCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        refreshDailyData();
    }

    @Scheduled(cron = "0 0 3 * * *")
    public void scheduledRefresh() {
        refreshDailyData();
    }

    /* ===================== LIVE / UPCOMING / RECENT ===================== */
    public String getLiveMatches() {
        return rapidApi.fetch(LIVE, TTL_20_MIN);
    }

    public String getUpcomingMatches() {
        return rapidApi.fetch(UPCOMING, TTL_6_HOUR);
    }

    public String getRecentMatches() {
        return rapidApi.fetch(RECENT, TTL_6_HOUR);
    }

    /* ===================== MATCH DETAILS ===================== */
    public String getMatchInfo(String matchId) {
        return rapidApi.fetch(String.format(MATCH_INFO, matchId), TTL_30_MIN);
    }

    public String getScorecard(String matchId) {
        return rapidApi.fetch(String.format(SCORECARD, matchId), TTL_10_MIN);
    }

    public String getCommentary(String matchId) {
        return rapidApi.fetch(String.format(COMMENTARY, matchId), TTL_5_MIN);
    }

    public String getSquads(String matchId) {
        return rapidApi.fetch(String.format(SQUADS, matchId), TTL_6_HOUR);
    }

    public String getOvers(String matchId) {
        return rapidApi.fetch(String.format(OVERS, matchId), TTL_2_MIN);
    }

    /* ===================== DYNAMIC RANKINGS ===================== */
    
    /**
     * Fetches international team rankings with dynamic filters.
     * @param formatType e.g., "t20", "odi", "test"
     * @param isWomen "0" for Men, "1" for Women
     */
    public String getRankings(String formatType, String isWomen) {
        String url = String.format("%s?formatType=%s&isWomen=%s", RANKINGS_TEAMS, formatType, isWomen);
        log.info("Fetching rankings from: {}", url);
        return rapidApi.fetch(url, TTL_24_HOUR);
    }

    /* ===================== OTHER STATS / NEWS ===================== */
    public String getTeams(String type) {
        return rapidApi.fetch(String.format(TEAMS, type), TTL_24_HOUR);
    }

    public String getPlayerInfo(String playerId) {
        return rapidApi.fetch(String.format(PLAYER, playerId), TTL_24_HOUR);
    }

    public String getVenueInfo(String venueId) {
        return rapidApi.fetch(String.format(VENUE, venueId), TTL_24_HOUR);
    }

    public String getNews() {
        return rapidApi.fetch(NEWS, TTL_2_HOUR);
    }

    public String getNewsDetails(String id) {
        return rapidApi.fetch(String.format(NEWS_DETAIL, id), TTL_24_HOUR);
    }

    /* ===================== CRICAPI DATA FETCHING ===================== */
    public void refreshDailyData() {
        log.info("Refreshing daily cricket reference data...");
        try {
            String suffix = "?apikey=" + cricApiKey;
            SeriesListResponse newSeries = restTemplate.getForObject(CRICAPI_BASE + "series" + suffix, SeriesListResponse.class);
            PlayerListResponse newPlayers = restTemplate.getForObject(CRICAPI_BASE + "players" + suffix, PlayerListResponse.class);
            CountryListResponse newCountries = restTemplate.getForObject(CRICAPI_BASE + "countries" + suffix, CountryListResponse.class);

            if (newSeries != null) cachedSeries = newSeries;
            if (newPlayers != null) cachedPlayers = newPlayers;
            if (newCountries != null) cachedCountries = newCountries;

            seriesDetailCache.clear();
            log.info("Daily reference data refreshed successfully.");
        } catch (Exception e) {
            log.error("Failed to refresh daily data from CricAPI: {}", e.getMessage());
        }
    }

    public SeriesListResponse getSeriesList() { return cachedSeries; }
    public CountryListResponse getCountryList() { return cachedCountries; }
    public PlayerListResponse getPlayerList() { return cachedPlayers; }

    public SeriesDetailResponse getSeriesDetail(String id) {
        if (id == null || id.isBlank()) return null;
        SeriesDetailResponse cached = seriesDetailCache.get(id);
        if (cached != null) return cached;

        try {
            String url = CRICAPI_BASE + "series_info?apikey=" + cricApiKey + "&id=" + id;
            SeriesDetailResponse response = restTemplate.getForObject(url, SeriesDetailResponse.class);
            if (response != null) seriesDetailCache.put(id, response);
            return response;
        } catch (Exception e) {
            log.error("Error fetching series details for {}: {}", id, e.getMessage());
            return null;
        }
    }
}