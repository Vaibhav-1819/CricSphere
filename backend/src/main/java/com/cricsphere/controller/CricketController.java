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
        MATCH CENTER (Clean + Frontend Friendly)
        ✅ These routes match your React MatchPage / matchApi usage
    ========================================================= */

    @GetMapping("/match/{matchId}")
    public ResponseEntity<String> getMatchOverview(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}", matchId);
        return ResponseEntity.ok(cricketService.getMatchOverview(matchId));
    }

    @GetMapping("/match/{matchId}/scorecard")
    public ResponseEntity<String> getMatchScorecard(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}/scorecard", matchId);
        return ResponseEntity.ok(cricketService.getMatchScorecard(matchId));
    }

    @GetMapping("/match/{matchId}/commentary")
    public ResponseEntity<String> getMatchCommentary(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}/commentary", matchId);
        return ResponseEntity.ok(cricketService.getMatchCommentary(matchId));
    }

    @GetMapping("/match/{matchId}/squads")
    public ResponseEntity<String> getMatchSquads(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}/squads", matchId);
        return ResponseEntity.ok(cricketService.getMatchSquads(matchId));
    }

    @GetMapping("/match/{matchId}/overs")
    public ResponseEntity<String> getMatchOvers(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}/overs", matchId);
        return ResponseEntity.ok(cricketService.getMatchOvers(matchId));
    }

    /* =========================================================
        BACKWARD COMPATIBILITY ROUTES (Optional)
        Keep these so older frontend calls won't break.
        You can delete later safely.
    ========================================================= */

    @GetMapping("/scorecard/{matchId}")
    public ResponseEntity<String> getScorecardLegacy(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/scorecard/{} (legacy)", matchId);
        return ResponseEntity.ok(cricketService.getMatchScorecard(matchId));
    }

    @GetMapping("/commentary/{matchId}")
    public ResponseEntity<String> getCommentaryLegacy(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/commentary/{} (legacy)", matchId);
        return ResponseEntity.ok(cricketService.getMatchCommentary(matchId));
    }

    @GetMapping("/squads/{matchId}")
    public ResponseEntity<String> getSquadsLegacy(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/squads/{} (legacy)", matchId);
        return ResponseEntity.ok(cricketService.getMatchSquads(matchId));
    }

    @GetMapping("/overs/{matchId}")
    public ResponseEntity<String> getOversLegacy(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/overs/{} (legacy)", matchId);
        return ResponseEntity.ok(cricketService.getMatchOvers(matchId));
    }

    /* =========================================================
        RANKINGS (Weekly update)
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
