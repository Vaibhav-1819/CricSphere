package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Match {

    // JsonAlias allows the same field to be populated by "id" (CricAPI) or "matchId" (Cricbuzz)
    @JsonProperty("id")
    @JsonAlias({"matchId", "id"})
    private String id;

    @JsonProperty("name")
    @JsonAlias({"matchDesc", "name"})
    private String name;

    @JsonProperty("matchType")
    @JsonAlias({"matchFormat", "matchType"})
    private String matchType;

    @JsonProperty("status")
    private String status;

    @JsonProperty("venue")
    @JsonAlias({"venueInfo", "venue"})
    private Object venue; // Flexible type to handle nested VenueInfo or String venue

    @JsonProperty("teams")
    @JsonAlias({"team1", "team2", "teams"})
    private Object teams;

    @JsonProperty("score")
    @JsonAlias({"matchScore", "score"})
    private Object score;
}