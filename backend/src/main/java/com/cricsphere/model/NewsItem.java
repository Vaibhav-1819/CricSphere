package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pure DTO for Cricbuzz News Story.
 * No computed fields. No UI logic.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsItem {

    @JsonProperty("id")
    private String id;

    @JsonProperty("hline")
    private String title;

    @JsonProperty("context")
    private String source;

    @JsonProperty("intro")
    private String description;

    @JsonProperty("imageId")
    private String imageId;

    @JsonProperty("pubTime")
    private String publishedAt;
}
