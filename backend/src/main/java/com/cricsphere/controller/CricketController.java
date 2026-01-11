package com.cricsphere.controller;

import com.cricsphere.model.*;
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

    @GetMapping("/current-matches")
    public ResponseEntity<CurrentMatchesResponse> getCurrentMatches() {
        log.info("Request received: Fetching live matches from cache");
        return ResponseEntity.ok(cricketService.getCurrentMatches());
    }

    @GetMapping("/series")
    public ResponseEntity<SeriesListResponse> getSeriesList() {
        log.info("Request received: Fetching series list");
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
        log.info("Request received: Fetching details for series ID: {}", seriesId);
        SeriesDetailResponse response = cricketService.getSeriesDetail(seriesId);
        
        if (response == null) {
            log.warn("Series detail not found for ID: {}", seriesId);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/news-feed")
    public ResponseEntity<NewsAggregationResponse> getNewsFeed() {
        log.info("Request received: Fetching news feed");
        return ResponseEntity.ok(cricketService.getNewsFeed());
    }
}