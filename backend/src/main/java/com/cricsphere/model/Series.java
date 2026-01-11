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
public class Series {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("startDate")
    private String startDate;

    @JsonProperty("endDate")
    private String endDate;

    @JsonProperty("t20")
    private int t20;

    @JsonProperty("odi")
    private int odi;

    @JsonProperty("test")
    private int test;

    @JsonProperty("squads")
    private int squads;

    @JsonProperty("matches")
    private int matches;

    /**
     * Helper to get total matches if the API doesn't provide a 'matches' sum.
     */
    public int getTotalMatchCount() {
        return t20 + odi + test;
    }
}