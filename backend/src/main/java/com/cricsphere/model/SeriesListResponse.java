package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SeriesListResponse {

    @JsonProperty("status")
    private String status;

    @Builder.Default
    @JsonProperty("data")
    private List<Series> data = new ArrayList<>();

    /**
     * Helper to verify if the list contains any series
     */
    public boolean hasSeries() {
        return data != null && !data.isEmpty();
    }
}