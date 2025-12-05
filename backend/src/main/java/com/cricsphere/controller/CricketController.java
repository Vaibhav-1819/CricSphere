package com.cricsphere.controller;

import com.cricsphere.model.*;
import com.cricsphere.service.CricketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cricket")
@CrossOrigin(origins = "*") // <--- ALLOWS REACT TO CONNECT WITHOUT ERRORS
public class CricketController {

    private final CricketService cricketService;

    @Autowired
    public CricketController(CricketService cricketService) {
        this.cricketService = cricketService;
    }

    @GetMapping("/current-matches")
    public CurrentMatchesResponse getCurrentMatches() {
        // Hits the RAM (Memory), NOT the API. Cost: 0.
        return cricketService.getCurrentMatches();
    }

    @GetMapping("/series")
    public SeriesListResponse getSeriesList() {
        return cricketService.getSeriesList();
    }

    @GetMapping("/countries")
    public CountryListResponse getCountryList() {
        return cricketService.getCountryList();
    }

    @GetMapping("/players")
    public PlayerListResponse getPlayerList() {
        return cricketService.getPlayerList();
    }

    @GetMapping("/series/{seriesId}")
    public SeriesDetailResponse getSeriesDetail(@PathVariable String seriesId) {
        return cricketService.getSeriesDetail(seriesId);
    }
    
    @GetMapping("/news-feed")
    public NewsAggregationResponse getNewsFeed() {
        return cricketService.getNewsFeed();
    }
}