package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pure DTO for Cricbuzz score.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Score {

    @JsonProperty("r")
    private int runs;

    @JsonProperty("w")
    private int wickets;

    @JsonProperty("o")
    private double overs;

    @JsonProperty("inning")
    private String inning;
}
