package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pure DTO for Cricbuzz match JSON.
 * No logic, no computation, no status interpretation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Match {

    @JsonProperty("matchId")
    private String matchId;

    @JsonProperty("matchDesc")
    private String matchDesc;

    @JsonProperty("matchFormat")
    private String matchFormat;

    @JsonProperty("status")
    private String status;

    @JsonProperty("venueInfo")
    private VenueInfo venueInfo;

    @JsonProperty("team1")
    private Team team1;

    @JsonProperty("team2")
    private Team team2;

    @JsonProperty("matchScore")
    private MatchScore matchScore;

    /* ===================== Nested DTOs ===================== */

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VenueInfo {
        private String ground;
        private String city;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Team {
        private String teamName;
        private String teamSName;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MatchScore {
        private TeamScore team1Score;
        private TeamScore team2Score;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TeamScore {
        @JsonProperty("inngs1")
        private Inning inning1;
        @JsonProperty("inngs2")
        private Inning inning2;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Inning {
        private String runs;
        private String wickets;
        private String overs;
    }
}
