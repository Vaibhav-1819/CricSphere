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
public class NewsItem {

    @JsonProperty("title")
    private String title;

    @JsonProperty("source")
    private String source;

    @JsonProperty("url")
    private String url;

    @JsonProperty("description")
    private String description; 

    @JsonProperty("image")
    private String image; 

    @JsonProperty("published_at")
    private String publishedAt;

    /**
     * Helper to get a preview of the description if it's too long.
     * Useful for UI news cards on the Vercel frontend.
     */
    public String getShortDescription() {
        if (description != null && description.length() > 100) {
            return description.substring(0, 97) + "...";
        }
        return description;
    }
}