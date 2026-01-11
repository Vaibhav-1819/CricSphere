package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Match {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("matchType")
    private String matchType; // e.g., "t20", "odi", "test"

    @JsonProperty("status")
    private String status; // e.g., "Match Started", "Stumps", "Result"

    @JsonProperty("venue")
    private String venue;

    @JsonProperty("date")
    private String date;

    @JsonProperty("dateTimeGMT")
    private String dateTimeGMT;

    @JsonProperty("teams")
    private java.util.List<String> teams; // Basic list of team names

    @JsonProperty("score")
    private java.util.List<Score> score; // Nested score details

    /**
     * Helper to check if the match is currently live based on the status string.
     */
    public boolean isLive() {
        if (status == null) return false;
        String lowerStatus = status.toLowerCase();
        return lowerStatus.contains("live") || lowerStatus.contains("started");
    }
}