package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Slf4j
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
    private String matchType; 

    @JsonProperty("status")
    private String status; 

    @JsonProperty("venue")
    private String venue;

    @JsonProperty("date")
    private String date;

    @JsonProperty("dateTimeGMT")
    private String dateTimeGMT;

    @JsonProperty("teams")
    private List<String> teams; 

    @JsonProperty("score")
    private List<Score> score; 

    /**
     * Helper to check if the match is currently live.
     * Expanded to catch more common live status indicators.
     */
    public boolean isLive() {
        if (status == null) return false;
        String lowerStatus = status.toLowerCase();
        return lowerStatus.contains("live") || 
               lowerStatus.contains("started") || 
               lowerStatus.contains("innings break") ||
               lowerStatus.contains("over");
    }
}