package com.cricsphere.controller;

import com.cricsphere.model.*;
import com.cricsphere.service.CricketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cricket")
// Note: Global CORS in SecurityConfig handles the React connection
public class CricketController {

    private final CricketService cricketService;

    public CricketController(CricketService cricketService) {
        this.cricketService = cricketService;
    }

    @GetMapping("/current-matches")
    public ResponseEntity<CurrentMatchesResponse> getCurrentMatches() {
        // Cached data from memory - High performance
        return ResponseEntity.ok(cricketService.getCurrentMatches());
    }

    @GetMapping("/series")
    public ResponseEntity<SeriesListResponse> getSeriesList() {
        return ResponseEntity.ok(cricketService.getSeriesList());
    }

    @GetMapping("/countries")
    public ResponseEntity<CountryListResponse> getCountryList() {
        return ResponseEntity.ok(cricketService.getCountryList());
    }

    @GetMapping("/players")
    public ResponseEntity<PlayerListResponse> getPlayerList() {
        return ResponseEntity.ok(cricketService.getPlayerList());
    }

    @GetMapping("/series/{seriesId}")
    public ResponseEntity<SeriesDetailResponse> getSeriesDetail(@PathVariable String seriesId) {
        return ResponseEntity.ok(cricketService.getSeriesDetail(seriesId));
    }
    
    @GetMapping("/news-feed")
    public ResponseEntity<NewsAggregationResponse> getNewsFeed() {
        return ResponseEntity.ok(cricketService.getNewsFeed());
    }
}