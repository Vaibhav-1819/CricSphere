package com.cricsphere.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class NewsItem {
    // Assuming the API returns at least a headline/title and a source
    @JsonProperty("title")
    private String title;
    @JsonProperty("source")
    private String source;
    @JsonProperty("url") // URL to the full article
    private String url;
    @JsonProperty("published_at")
    private String publishedAt;
}