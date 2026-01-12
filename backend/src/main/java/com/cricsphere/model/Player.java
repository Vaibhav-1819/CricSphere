package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pure DTO for Cricbuzz Player.
 * No computed fields, no logic, no formatting.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Player {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("country")
    private String country;

    @JsonProperty("role")
    private String role;

    @JsonProperty("battingStyle")
    private String battingStyle;

    @JsonProperty("bowlingStyle")
    private String bowlingStyle;

    @JsonProperty("faceImageId")
    private String faceImageId;
}
