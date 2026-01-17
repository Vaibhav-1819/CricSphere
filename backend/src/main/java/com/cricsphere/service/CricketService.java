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

    /* =========================================================
        CricAPI (Reference data)
    ========================================================= */
    @Value("${cricapi.key}")
    private String cricApiKey;

    private static final String CRICAPI_BASE = "https://api.cricapi.com/v1/";

    /* =========================================================
        RapidAPI Cricbuzz Base
    ========================================================= */
    private static final String RAPID_BASE = "https://cricbuzz-cricket2.p.rapidapi.com";

    /* ===================== HOME ===================== */
    private static final String HOME_INDEX = RAPID_BASE + "/home/v1/index";

    /* ===================== MATCHES ===================== */
    private static final String LIVE     = RAPID_BASE + "/matches/v1/live";
    private static final String UPCOMING = RAPID_BASE + "/matches/v1/upcoming";
    private static final String RECENT   = RAPID_BASE + "/matches/v1/recent";

    /* ===================== MATCH CENTER ===================== */
    private static final String MATCH_INFO   = RAPID_BASE + "/mcenter/v1/%s";
    private static final String SCORECARD    = RAPID_BASE + "/mcenter/v1/%s/scard";
    private static final String COMMENTARY   = RAPID_BASE + "/mcenter/v1/%s/comm";
    private static final String H_COMMENTARY = RAPID_BASE + "/mcenter/v1/%s/hcomm";
    private static final String SQUADS       = RAPID_BASE + "/mcenter/v1/%s/teams";
    private static final String OVERS        = RAPID_BASE + "/mcenter/v1/%s/overs";
    private static final String HIGHLIGHTS   = RAPID_BASE + "/mcenter/v1/%s/hlights";
    private static final String LEANBACK     = RAPID_BASE + "/mcenter/v1/%s/leanback";
    private static final String H_LEANBACK   = RAPID_BASE + "/mcenter/v1/%s/hleanback";

    /* ===================== NEWS ===================== */
    private static final String NEWS        = RAPID_BASE + "/news/v1/index";
    private static final String NEWS_DETAIL = RAPID_BASE + "/news/v1/detail/%s";

    /* ===================== TEAMS ===================== */
    private static final String TEAMS_LIST     = RAPID_BASE + "/teams/v1/%s";
    private static final String TEAM_SCHEDULE  = RAPID_BASE + "/teams/v1/%s/schedule";
    private static final String TEAM_RESULTS   = RAPID_BASE + "/teams/v1/%s/results";
    private static final String TEAM_PLAYERS   = RAPID_BASE + "/teams/v1/%s/players";
    private static final String TEAM_STATS     = RAPID_BASE + "/stats/v1/team/%s";
    private static final String TEAM_NEWS      = RAPID_BASE + "/news/v1/team/%s";

    /* ===================== PLAYERS ===================== */
    private static final String PLAYER_INFO    = RAPID_BASE + "/stats/v1/player/%s";
    private static final String PLAYER_BATTING = RAPID_BASE + "/stats/v1/player/%s/batting";
    private static final String PLAYER_BOWLING = RAPID_BASE + "/stats/v1/player/%s/bowling";
    private static final String PLAYER_CAREER  = RAPID_BASE + "/stats/v1/player/%s/career";

    /* ===================== VENUES ===================== */
    private static final String VENUE_INFO    = RAPID_BASE + "/venues/v1/%s";
    private static final String VENUE_MATCHES = RAPID_BASE + "/venues/v1/%s/matches";
    private static final String VENUE_STATS   = RAPID_BASE + "/stats/v1/venue/%s";

    /* ===================== RANKINGS (Weekly) ===================== */
    private static final String RANKINGS_TEAMS = RAPID_BASE + "/stats/v1/rankings/teams";

    /* =========================================================
        TTL Strategy (Optimized for < 100 calls/day)
    ========================================================= */
    private static final long TTL_10_MIN  = 10 * 60 * 1000L;
    private static final long TTL_24_HOUR = 24 * 60 * 60 * 1000L;
    private static final long TTL_7_DAYS  = 7L * 24 * 60 * 60 * 1000L;

    private final RapidApiClient rapidApi;
    private final RestTemplate restTemplate;

    /* ===================== CricAPI Cached Reference Data ===================== */
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

    /* =========================================================
        HOME
    ========================================================= */
    public String getHomeIndex() {
        return rapidApi.fetch(HOME_INDEX, TTL_24_HOUR);
    }

    /* =========================================================
        MATCHES
    ========================================================= */
    public String getLiveMatches() {
        return rapidApi.fetch(LIVE, TTL_10_MIN);
    }

    public String getUpcomingMatches() {
        return rapidApi.fetch(UPCOMING, TTL_24_HOUR);
    }

    public String getRecentMatches() {
        return rapidApi.fetch(RECENT, TTL_24_HOUR);
    }

    /* =========================================================
        MATCH CENTER (User-friendly endpoints)
    ========================================================= */
    public String getMatchOverview(String matchId) {
        return rapidApi.fetch(String.format(MATCH_INFO, matchId), TTL_10_MIN);
    }

    public String getMatchScorecard(String matchId) {
        return rapidApi.fetch(String.format(SCORECARD, matchId), TTL_10_MIN);
    }

    public String getMatchCommentary(String matchId) {
        return rapidApi.fetch(String.format(COMMENTARY, matchId), TTL_10_MIN);
    }

    public String getMatchHCommentary(String matchId) {
        return rapidApi.fetch(String.format(H_COMMENTARY, matchId), TTL_10_MIN);
    }

    public String getMatchSquads(String matchId) {
        return rapidApi.fetch(String.format(SQUADS, matchId), TTL_24_HOUR);
    }

    public String getMatchOvers(String matchId) {
        return rapidApi.fetch(String.format(OVERS, matchId), TTL_10_MIN);
    }

    public String getMatchHighlights(String matchId) {
        return rapidApi.fetch(String.format(HIGHLIGHTS, matchId), TTL_24_HOUR);
    }

    public String getMatchLeanback(String matchId) {
        return rapidApi.fetch(String.format(LEANBACK, matchId), TTL_24_HOUR);
    }

    public String getMatchHLeanback(String matchId) {
        return rapidApi.fetch(String.format(H_LEANBACK, matchId), TTL_24_HOUR);
    }

    /* =========================================================
        Backward compatibility (old names)
    ========================================================= */
    public String getMatchInfo(String matchId) {
        return getMatchOverview(matchId);
    }

    public String getScorecard(String matchId) {
        return getMatchScorecard(matchId);
    }

    public String getCommentary(String matchId) {
        return getMatchCommentary(matchId);
    }

    public String getSquads(String matchId) {
        return getMatchSquads(matchId);
    }

    public String getOvers(String matchId) {
        return getMatchOvers(matchId);
    }

    /* =========================================================
        RANKINGS (Weekly)
    ========================================================= */
    public String getRankings(String format, String isWomen) {
        String url = String.format("%s?formatType=%s&isWomen=%s", RANKINGS_TEAMS, format, isWomen);
        log.info("📊 Rankings URL: {}", url);
        return rapidApi.fetch(url, TTL_7_DAYS);
    }

    /* =========================================================
        TEAMS
    ========================================================= */
    public String getTeams(String type) {
        if (type == null || type.isBlank()) type = "all";

        type = type.trim().toLowerCase();

        if ("all".equals(type)) {
            String international = rapidApi.fetch(String.format(TEAMS_LIST, "international"), TTL_7_DAYS);
            String league        = rapidApi.fetch(String.format(TEAMS_LIST, "league"), TTL_7_DAYS);
            String domestic      = rapidApi.fetch(String.format(TEAMS_LIST, "domestic"), TTL_7_DAYS);
            String women         = rapidApi.fetch(String.format(TEAMS_LIST, "women"), TTL_7_DAYS);

            return String.format(
                    "{\"international\":%s,\"league\":%s,\"domestic\":%s,\"women\":%s}",
                    safeJson(international),
                    safeJson(league),
                    safeJson(domestic),
                    safeJson(women)
            );
        }

        return rapidApi.fetch(String.format(TEAMS_LIST, type), TTL_7_DAYS);
    }

    public String getTeamSchedule(String teamId) {
        return rapidApi.fetch(String.format(TEAM_SCHEDULE, teamId), TTL_24_HOUR);
    }

    public String getTeamResults(String teamId) {
        return rapidApi.fetch(String.format(TEAM_RESULTS, teamId), TTL_24_HOUR);
    }

    public String getTeamPlayers(String teamId) {
        return rapidApi.fetch(String.format(TEAM_PLAYERS, teamId), TTL_7_DAYS);
    }

    public String getTeamStats(String teamId) {
        return rapidApi.fetch(String.format(TEAM_STATS, teamId), TTL_7_DAYS);
    }

    public String getTeamNews(String teamId) {
        return rapidApi.fetch(String.format(TEAM_NEWS, teamId), TTL_24_HOUR);
    }

    /* =========================================================
        PLAYERS
    ========================================================= */
    public String getPlayerInfo(String playerId) {
        return rapidApi.fetch(String.format(PLAYER_INFO, playerId), TTL_7_DAYS);
    }

    public String getPlayerBatting(String playerId) {
        return rapidApi.fetch(String.format(PLAYER_BATTING, playerId), TTL_7_DAYS);
    }

    public String getPlayerBowling(String playerId) {
        return rapidApi.fetch(String.format(PLAYER_BOWLING, playerId), TTL_7_DAYS);
    }

    public String getPlayerCareer(String playerId) {
        return rapidApi.fetch(String.format(PLAYER_CAREER, playerId), TTL_7_DAYS);
    }

    /* =========================================================
        VENUES
    ========================================================= */
    public String getVenueInfo(String venueId) {
        return rapidApi.fetch(String.format(VENUE_INFO, venueId), TTL_7_DAYS);
    }

    public String getVenueMatches(String venueId) {
        return rapidApi.fetch(String.format(VENUE_MATCHES, venueId), TTL_24_HOUR);
    }

    public String getVenueStats(String venueId) {
        return rapidApi.fetch(String.format(VENUE_STATS, venueId), TTL_7_DAYS);
    }

    /* =========================================================
        NEWS
    ========================================================= */
    public String getNews() {
        return rapidApi.fetch(NEWS, TTL_24_HOUR);
    }

    public String getNewsDetails(String id) {
        return rapidApi.fetch(String.format(NEWS_DETAIL, id), TTL_7_DAYS);
    }

    /* =========================================================
        CRICAPI (Reference Data) - refresh daily
    ========================================================= */
    public void refreshDailyData() {
        log.info("🔄 Refreshing daily cricket reference data (CricAPI)...");
        try {
            String suffix = "?apikey=" + cricApiKey;

            SeriesListResponse newSeries = restTemplate.getForObject(
                    CRICAPI_BASE + "series" + suffix,
                    SeriesListResponse.class
            );

            PlayerListResponse newPlayers = restTemplate.getForObject(
                    CRICAPI_BASE + "players" + suffix,
                    PlayerListResponse.class
            );

            CountryListResponse newCountries = restTemplate.getForObject(
                    CRICAPI_BASE + "countries" + suffix,
                    CountryListResponse.class
            );

            if (newSeries != null) cachedSeries = newSeries;
            if (newPlayers != null) cachedPlayers = newPlayers;
            if (newCountries != null) cachedCountries = newCountries;

            seriesDetailCache.clear();
            log.info("✅ Daily reference data refreshed successfully.");
        } catch (Exception e) {
            log.error("❌ Failed to refresh daily data from CricAPI: {}", e.getMessage());
        }
    }

    public SeriesListResponse getSeriesList() {
        return cachedSeries;
    }

    public CountryListResponse getCountryList() {
        return cachedCountries;
    }

    public PlayerListResponse getPlayerList() {
        return cachedPlayers;
    }

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
            log.error("❌ Error fetching series details for {}: {}", id, e.getMessage());
            return null;
        }
    }

    /* =========================================================
        Utility: Safe JSON embedding
    ========================================================= */
    private String safeJson(String raw) {
        if (raw == null || raw.isBlank()) return "{}";

        String trimmed = raw.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            return trimmed;
        }

        return String.format("{\"raw\":\"%s\"}", trimmed.replace("\"", "\\\""));
    }
}
