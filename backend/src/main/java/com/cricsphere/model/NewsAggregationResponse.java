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
public class NewsAggregationResponse {

    @JsonProperty("status")
    private String status;

    @JsonProperty("data")
    private NewsData data;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NewsData {
        @Builder.Default
        @JsonProperty("news")
        private List<NewsItem> news = new ArrayList<>();
    }

    /**
     * Helper to verify if the response actually contains news items.
     */
    public boolean hasNews() {
        boolean exists = data != null && data.getNews() != null && !data.getNews().isEmpty();
        if (!exists) {
            log.warn("News aggregation returned status '{}' but no news items were found.", status);
        }
        return exists;
    }
}