package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CurrentMatchesResponse {

    @JsonProperty("status")
    private String status;

    @Builder.Default
    @JsonProperty("data")
    private List<Match> data = new ArrayList<>();

    /**
     * Checks if the response contains live matches.
     * Logs the count for monitoring purposes.
     */
    public boolean hasMatches() {
        boolean exists = data != null && !data.isEmpty();
        if (exists) {
            log.info("Found {} live matches in the current response.", data.size());
        } else {
            log.warn("CurrentMatches API returned an empty data list.");
        }
        return exists;
    }
}