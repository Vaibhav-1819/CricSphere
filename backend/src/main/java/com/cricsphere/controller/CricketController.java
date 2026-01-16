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
        LIVE / UPCOMING / RECENT
    ========================================================= */

    @GetMapping("/live")
    public ResponseEntity<Object> getLiveMatches() {
        log.info("GET /api/v1/cricket/live");
        return ResponseEntity.ok(cricketService.getLiveMatches());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Object> getUpcomingMatches() {
        log.info("GET /api/v1/cricket/upcoming");
        return ResponseEntity.ok(cricketService.getUpcomingMatches());
    }

    @GetMapping("/recent")
    public ResponseEntity<Object> getRecentMatches() {
        log.info("GET /api/v1/cricket/recent");
        return ResponseEntity.ok(cricketService.getRecentMatches());
    }

    /* =========================================================
        MATCH DATA
    ========================================================= */

    @GetMapping("/match/{matchId}")
    public ResponseEntity<Object> getMatchInfo(@PathVariable String matchId) {
        log.info("GET /api/v1/cricket/match/{}", matchId);
        return ResponseEntity.ok(cricketService.getMatchInfo(matchId));
    }

    @GetMapping("/scorecard/{matchId}")
    public ResponseEntity<Object> getScorecard(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getScorecard(matchId));
    }

    @GetMapping("/commentary/{matchId}")
    public ResponseEntity<Object> getCommentary(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getCommentary(matchId));
    }

    @GetMapping("/squads/{matchId}")
    public ResponseEntity<Object> getSquads(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getSquads(matchId));
    }

    @GetMapping("/overs/{matchId}")
    public ResponseEntity<Object> getOvers(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getOvers(matchId));
    }

    /* =========================================================
        SERIES / STATS (INTERNATIONAL RANKINGS)
    ========================================================= */

    @GetMapping("/series")
    public ResponseEntity<Object> getSeries() {
        return ResponseEntity.ok(cricketService.getSeriesList());
    }

    @GetMapping("/series/{seriesId}")
    public ResponseEntity<Object> getSeriesDetail(@PathVariable String seriesId) {
        return ResponseEntity.ok(cricketService.getSeriesDetail(seriesId));
    }

    /**
     * Dynamic International Rankings
     * Supports params: format (t20, odi, test) and isWomen (0 or 1)
     */
    @GetMapping("/rankings/international")
    public ResponseEntity<Object> getRankings(
            @RequestParam(defaultValue = "t20") String format,
            @RequestParam(defaultValue = "0") String isWomen) {
        log.info("GET /api/v1/cricket/rankings/international | Format: {}, Women: {}", format, isWomen);
        return ResponseEntity.ok(cricketService.getRankings(format, isWomen));
    }

    /* =========================================================
        TEAMS / PLAYERS / VENUES
    ========================================================= */

    @GetMapping("/teams")
    public ResponseEntity<Object> getTeamsDefault() {
        return ResponseEntity.ok(cricketService.getTeams("all"));
    }

    @GetMapping("/teams/{type}")
    public ResponseEntity<Object> getTeams(@PathVariable String type) {
        return ResponseEntity.ok(cricketService.getTeams(type));
    }

    /* =========================================================
        NEWS
    ========================================================= */

    @GetMapping("/news")
    public ResponseEntity<Object> getNews() {
        return ResponseEntity.ok(cricketService.getNews());
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<Object> getNewsDetails(@PathVariable String id) {
        return ResponseEntity.ok(cricketService.getNewsDetails(id));
    }
}