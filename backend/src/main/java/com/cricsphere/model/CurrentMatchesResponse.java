package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

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
     * Useful for checking if any matches are currently live
     * without checking for nulls or size in the controller.
     */
    public boolean hasMatches() {
        return data != null && !data.isEmpty();
    }
}