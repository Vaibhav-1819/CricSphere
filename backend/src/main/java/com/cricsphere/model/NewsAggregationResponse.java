package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Raw DTO for RapidAPI Cricbuzz news/v1/index endpoint.
 * This class must stay pure.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsAggregationResponse {

    @JsonProperty("status")
    private String status;

    // Cricbuzz wraps stories inside this array
    @JsonProperty("storyList")
    private List<StoryWrapper> storyList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StoryWrapper {
        @JsonProperty("story")
        private NewsItem story;
    }
}
