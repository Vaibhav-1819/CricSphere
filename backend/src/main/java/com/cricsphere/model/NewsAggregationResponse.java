package com.cricsphere.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Data
public class NewsAggregationResponse {
    @JsonProperty("status")
    private String status;
    @JsonProperty("data")
    private NewsData data; // Note: data is a complex object here

    @Data
    public static class NewsData {
        @JsonProperty("news") // This must be an array of NewsItem
        private List<NewsItem> news;
    }
}
