package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Slf4j
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

    @JsonProperty("faceImage")
    private String faceImage; 

    /**
     * Helper to return a placeholder image if the faceImage is null.
     */
    public String getSafeFaceImage() {
        if (faceImage == null || faceImage.isEmpty()) {
            return "https://static.cricsphere.com/placeholders/player-placeholder.png";
        }
        return faceImage;
    }
}