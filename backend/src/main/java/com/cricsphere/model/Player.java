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
public class Player {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("country")
    private String country;

    @JsonProperty("role")
    private String role; // e.g., "Batsman", "Bowler", "Wicketkeeper"

    @JsonProperty("battingStyle")
    private String battingStyle; // e.g., "Right-hand bat"

    @JsonProperty("bowlingStyle")
    private String bowlingStyle; // e.g., "Right-arm fast"

    @JsonProperty("faceImage")
    private String faceImage; // URL to player's profile picture
}