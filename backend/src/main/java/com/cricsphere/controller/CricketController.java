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
    public ResponseEntity<String> getLiveMatches() {
        log.info("GET /live");
        return ResponseEntity.ok(cricketService.getLiveMatches());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<String> getUpcomingMatches() {
        log.info("GET /upcoming");
        return ResponseEntity.ok(cricketService.getUpcomingMatches());
    }

    @GetMapping("/recent")
    public ResponseEntity<String> getRecentMatches() {
        log.info("GET /recent");
        return ResponseEntity.ok(cricketService.getRecentMatches());
    }

    /* =========================================================
       MATCH DATA
    ========================================================= */

    @GetMapping("/match/{matchId}")
    public ResponseEntity<String> getMatchInfo(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getMatchInfo(matchId));
    }

    @GetMapping("/scorecard/{matchId}")
    public ResponseEntity<String> getScorecard(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getScorecard(matchId));
    }

    @GetMapping("/commentary/{matchId}")
    public ResponseEntity<String> getCommentary(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getCommentary(matchId));
    }

    @GetMapping("/squads/{matchId}")
    public ResponseEntity<String> getSquads(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getSquads(matchId));
    }

    @GetMapping("/overs/{matchId}")
    public ResponseEntity<String> getOvers(@PathVariable String matchId) {
        return ResponseEntity.ok(cricketService.getOvers(matchId));
    }

    /* =========================================================
       SERIES / STATS
    ========================================================= */

    @GetMapping("/series")
    public ResponseEntity<?> getSeries() {
        return ResponseEntity.ok(cricketService.getSeriesList());
    }

    @GetMapping("/series/{seriesId}")
    public ResponseEntity<?> getSeriesDetail(@PathVariable String seriesId) {
        return ResponseEntity.ok(cricketService.getSeriesDetail(seriesId));
    }

    @GetMapping("/rankings")
    public ResponseEntity<String> getRankings() {
        return ResponseEntity.ok(cricketService.getRankings());
    }

    /* =========================================================
       TEAMS / PLAYERS / VENUES
    ========================================================= */

    @GetMapping("/teams/{type}")
    public ResponseEntity<String> getTeams(@PathVariable String type) {
        return ResponseEntity.ok(cricketService.getTeams(type));
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<String> getPlayer(@PathVariable String playerId) {
        return ResponseEntity.ok(cricketService.getPlayerInfo(playerId));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<String> getVenue(@PathVariable String venueId) {
        return ResponseEntity.ok(cricketService.getVenueInfo(venueId));
    }

    /* =========================================================
       NEWS
    ========================================================= */

    @GetMapping("/news")
    public ResponseEntity<String> getNews() {
        return ResponseEntity.ok(cricketService.getNews());
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<String> getNewsDetails(@PathVariable String id) {
        return ResponseEntity.ok(cricketService.getNewsDetails(id));
    }
}
