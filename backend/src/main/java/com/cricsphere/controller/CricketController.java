package com.cricsphere.controller;

import com.cricsphere.service.CricketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/cricket")
public class CricketController {

    private final CricketService cricketService;

    public CricketController(CricketService cricketService) {
        this.cricketService = cricketService;
    }

    /* =========================================================
        MATCHES: LIVE / UPCOMING / RECENT
       Strategy:
       - Live: small TTL (fast updates)
       - Upcoming/Recent: long TTL (low change)
    ========================================================= */

    @GetMapping("/live")
    public ResponseEntity<String> getLiveMatches() {
        log.info("GET /api/v1/cricket/live");
        return ResponseEntity.ok(cricketService.getLiveMatches());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<String> getUpcomingMatches() {
        log.info("GET /api/v1/cricket/upcoming");
        return ResponseEntity.ok(cricketService.getUpcomingMatches());
    }

    @GetMapping("/recent")
    public ResponseEntity<String> getRecentMatches() {
        log.info("GET /api/v1/cricket/recent");
        return ResponseEntity.ok(cricketService.getRecentMatches());
    }

    /* =========================================================
        MATCH CENTER (mcenter)
    ========================================================= */

    @GetMapping("/match/{matchId}")
    public ResponseEntity<String> getMatchInfo(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}", matchId);
        return ResponseEntity.ok(cricketService.getMatchInfo(matchId));
    }

    @GetMapping("/scorecard/{matchId}")
    public ResponseEntity<String> getScorecard(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/scorecard/{}", matchId);
        return ResponseEntity.ok(cricketService.getScorecard(matchId));
    }

    @GetMapping("/commentary/{matchId}")
    public ResponseEntity<String> getCommentary(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/commentary/{}", matchId);
        return ResponseEntity.ok(cricketService.getCommentary(matchId));
    }

    @GetMapping("/squads/{matchId}")
    public ResponseEntity<String> getSquads(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/squads/{}", matchId);
        return ResponseEntity.ok(cricketService.getSquads(matchId));
    }

    @GetMapping("/overs/{matchId}")
    public ResponseEntity<String> getOvers(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/overs/{}", matchId);
        return ResponseEntity.ok(cricketService.getOvers(matchId));
    }

    /* =========================================================
        RANKINGS (Weekly update)
        Strategy: Cache for 7 days (weekly)
        Params:
          - format: t20 / odi / test
          - isWomen: 0 / 1
    ========================================================= */

    @GetMapping("/rankings/international")
    public ResponseEntity<String> getRankings(
            @RequestParam(defaultValue = "t20") String format,
            @RequestParam(defaultValue = "0") String isWomen
    ) {
        log.info("GET /api/v1/cricket/rankings/international | format={}, isWomen={}", format, isWomen);
        return ResponseEntity.ok(cricketService.getRankings(format, isWomen));
    }

    /* =========================================================
        TEAMS
        type:
          - international | league | domestic | women | all
    ========================================================= */

    @GetMapping("/teams/{type}")
    public ResponseEntity<String> getTeams(@PathVariable String type) {
        log.info("GET /api/v1/cricket/teams/{}", type);
        return ResponseEntity.ok(cricketService.getTeams(type));
    }

    @GetMapping("/teams")
    public ResponseEntity<String> getTeamsDefault() {
        log.info("GET /api/v1/cricket/teams (default=all)");
        return ResponseEntity.ok(cricketService.getTeams("all"));
    }

    /* =========================================================
        TEAM DETAILS
    ========================================================= */

    @GetMapping("/team/{teamId}/schedule")
    public ResponseEntity<String> getTeamSchedule(@PathVariable String teamId) {
        log.info("GET /api/v1/cricket/team/{}/schedule", teamId);
        return ResponseEntity.ok(cricketService.getTeamSchedule(teamId));
    }

    @GetMapping("/team/{teamId}/results")
    public ResponseEntity<String> getTeamResults(@PathVariable String teamId) {
        log.info("GET /api/v1/cricket/team/{}/results", teamId);
        return ResponseEntity.ok(cricketService.getTeamResults(teamId));
    }

    @GetMapping("/team/{teamId}/players")
    public ResponseEntity<String> getTeamPlayers(@PathVariable String teamId) {
        log.info("GET /api/v1/cricket/team/{}/players", teamId);
        return ResponseEntity.ok(cricketService.getTeamPlayers(teamId));
    }

    @GetMapping("/team/{teamId}/stats")
    public ResponseEntity<String> getTeamStats(@PathVariable String teamId) {
        log.info("GET /api/v1/cricket/team/{}/stats", teamId);
        return ResponseEntity.ok(cricketService.getTeamStats(teamId));
    }

    @GetMapping("/team/{teamId}/news")
    public ResponseEntity<String> getTeamNews(@PathVariable String teamId) {
        log.info("GET /api/v1/cricket/team/{}/news", teamId);
        return ResponseEntity.ok(cricketService.getTeamNews(teamId));
    }

    /* =========================================================
        PLAYERS
    ========================================================= */

    @GetMapping("/player/{playerId}")
    public ResponseEntity<String> getPlayerInfo(@PathVariable String playerId) {
        log.info("GET /api/v1/cricket/player/{}", playerId);
        return ResponseEntity.ok(cricketService.getPlayerInfo(playerId));
    }

    @GetMapping("/player/{playerId}/batting")
    public ResponseEntity<String> getPlayerBatting(@PathVariable String playerId) {
        log.info("GET /api/v1/cricket/player/{}/batting", playerId);
        return ResponseEntity.ok(cricketService.getPlayerBatting(playerId));
    }

    @GetMapping("/player/{playerId}/bowling")
    public ResponseEntity<String> getPlayerBowling(@PathVariable String playerId) {
        log.info("GET /api/v1/cricket/player/{}/bowling", playerId);
        return ResponseEntity.ok(cricketService.getPlayerBowling(playerId));
    }

    @GetMapping("/player/{playerId}/career")
    public ResponseEntity<String> getPlayerCareer(@PathVariable String playerId) {
        log.info("GET /api/v1/cricket/player/{}/career", playerId);
        return ResponseEntity.ok(cricketService.getPlayerCareer(playerId));
    }

    /* =========================================================
        VENUES
    ========================================================= */

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<String> getVenueInfo(@PathVariable String venueId) {
        log.info("GET /api/v1/cricket/venue/{}", venueId);
        return ResponseEntity.ok(cricketService.getVenueInfo(venueId));
    }

    @GetMapping("/venue/{venueId}/matches")
    public ResponseEntity<String> getVenueMatches(@PathVariable String venueId) {
        log.info("GET /api/v1/cricket/venue/{}/matches", venueId);
        return ResponseEntity.ok(cricketService.getVenueMatches(venueId));
    }

    @GetMapping("/venue/{venueId}/stats")
    public ResponseEntity<String> getVenueStats(@PathVariable String venueId) {
        log.info("GET /api/v1/cricket/venue/{}/stats", venueId);
        return ResponseEntity.ok(cricketService.getVenueStats(venueId));
    }

    /* =========================================================
        SERIES (CricAPI cached daily)
    ========================================================= */

    @GetMapping("/series")
    public ResponseEntity<Object> getSeries() {
        log.info("GET /api/v1/cricket/series");
        return ResponseEntity.ok(cricketService.getSeriesList());
    }

    @GetMapping("/series/{seriesId}")
    public ResponseEntity<Object> getSeriesDetail(@PathVariable String seriesId) {
        log.info("GET /api/v1/cricket/series/{}", seriesId);
        return ResponseEntity.ok(cricketService.getSeriesDetail(seriesId));
    }

    /* =========================================================
        NEWS
        Strategy: refresh every 10–30 minutes
    ========================================================= */

    @GetMapping("/news")
    public ResponseEntity<String> getNews() {
        log.info("GET /api/v1/cricket/news");
        return ResponseEntity.ok(cricketService.getNews());
    }

    @GetMapping("/news/{newsId}")
    public ResponseEntity<String> getNewsDetails(@PathVariable String newsId) {
        log.info("GET /api/v1/cricket/news/{}", newsId);
        return ResponseEntity.ok(cricketService.getNewsDetails(newsId));
    }
}
