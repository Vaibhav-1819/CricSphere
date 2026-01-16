package com.cricsphere.service;

import com.cricsphere.integration.RapidApiClient;
import com.cricsphere.model.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor // Simplifies constructor injection
public class CricketService {

    @Value("${cricapi.key}")
    private String cricApiKey;

    private static final String CRICAPI_BASE = "https://api.cricapi.com/v1/";

    /* ===================== Cricbuzz URLs ===================== */
    private static final String LIVE       = "https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/live";
    private static final String UPCOMING   = "https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/upcoming";
    private static final String RECENT     = "https://cricbuzz-cricket2.p.rapidapi.com/matches/v1/recent";
    private static final String MATCH_INFO = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s";
    private static final String SCORECARD  = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/scard";
    private static final String COMMENTARY = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/comm";
    private static final String SQUADS     = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/team";
    private static final String OVERS      = "https://cricbuzz-cricket2.p.rapidapi.com/mcenter/v1/%s/overs";
    private static final String RANKINGS   = "https://cricbuzz-cricket2.p.rapidapi.com/stats/v1/rankings";
    private static final String NEWS       = "https://cricbuzz-cricket2.p.rapidapi.com/news/v1/index";
    private static final String NEWS_DETAIL= "https://cricbuzz-cricket2.p.rapidapi.com/news/v1/detail/%s";
    private static final String TEAMS      = "https://cricbuzz-cricket2.p.rapidapi.com/teams/v1/%s";
    private static final String PLAYER     = "https://cricbuzz-cricket2.p.rapidapi.com/stats/v1/player/%s";
    private static final String VENUE      = "https://cricbuzz-cricket2.p.rapidapi.com/venue/v1/%s";

    private final RapidApiClient rapidApi;
    private final RestTemplate restTemplate;

    /* ===================== CricAPI Cache ===================== */
    private volatile SeriesListResponse cachedSeries;
    private volatile CountryListResponse cachedCountries;
    private volatile PlayerListResponse cachedPlayers;
    private final Map<String, SeriesDetailResponse> seriesDetailCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        refreshDailyData();
    }

    /* ===================== LIVE / UPCOMING / RECENT ===================== */
    public String getLiveMatches() { return rapidApi.fetch(LIVE, 20 * 60 * 1000); }
    public String getUpcomingMatches() { return rapidApi.fetch(UPCOMING, 6 * 60 * 60 * 1000); }
    public String getRecentMatches() { return rapidApi.fetch(RECENT, 6 * 60 * 60 * 1000); }

    /* ===================== MATCH DETAILS ===================== */
    public String getMatchInfo(String matchId) { return rapidApi.fetch(String.format(MATCH_INFO, matchId), 30 * 60 * 1000); }
    public String getScorecard(String matchId) { return rapidApi.fetch(String.format(SCORECARD, matchId), 10 * 60 * 1000); }
    public String getCommentary(String matchId) { return rapidApi.fetch(String.format(COMMENTARY, matchId), 5 * 60 * 1000); }
    public String getSquads(String matchId) { return rapidApi.fetch(String.format(SQUADS, matchId), 6 * 60 * 60 * 1000); }
    public String getOvers(String matchId) { return rapidApi.fetch(String.format(OVERS, matchId), 2 * 60 * 1000); }

    /* ===================== STATS / NEWS ===================== */
    public String getRankings() { return rapidApi.fetch(RANKINGS, 24 * 60 * 60 * 1000); }
    public String getTeams(String type) { return rapidApi.fetch(String.format(TEAMS, type), 24 * 60 * 60 * 1000); }
    public String getPlayerInfo(String playerId) { return rapidApi.fetch(String.format(PLAYER, playerId), 24 * 60 * 60 * 1000); }
    public String getVenueInfo(String venueId) { return rapidApi.fetch(String.format(VENUE, venueId), 24 * 60 * 60 * 1000); }
    public String getNews() { return rapidApi.fetch(NEWS, 2 * 60 * 60 * 1000); }
    public String getNewsDetails(String id) { return rapidApi.fetch(String.format(NEWS_DETAIL, id), 24 * 60 * 60 * 1000); }

    /* ===================== CRICAPI DATA FETCHING ===================== */
    public void refreshDailyData() {
        log.info("Refreshing daily cricket reference data...");
        try {
            String suffix = "?apikey=" + cricApiKey;
            cachedSeries = restTemplate.getForObject(CRICAPI_BASE + "series" + suffix, SeriesListResponse.class);
            cachedPlayers = restTemplate.getForObject(CRICAPI_BASE + "players" + suffix, PlayerListResponse.class);
            cachedCountries = restTemplate.getForObject(CRICAPI_BASE + "countries" + suffix, CountryListResponse.class);
            seriesDetailCache.clear();
        } catch (Exception e) {
            log.error("Failed to refresh daily data from CricAPI: {}", e.getMessage());
        }
    }

    public SeriesListResponse getSeriesList() { return cachedSeries; }
    public CountryListResponse getCountryList() { return cachedCountries; }
    public PlayerListResponse getPlayerList() { return cachedPlayers; }

    public SeriesDetailResponse getSeriesDetail(String id) {
        return seriesDetailCache.computeIfAbsent(id, key -> {
            try {
                String url = CRICAPI_BASE + "series_info?apikey=" + cricApiKey + "&id=" + key;
                return restTemplate.getForObject(url, SeriesDetailResponse.class);
            } catch (Exception e) {
                log.error("Error fetching series details for {}: {}", key, e.getMessage());
                return null; // Ensure cache doesn't prevent future retries if desired
            }
        });
    }
}