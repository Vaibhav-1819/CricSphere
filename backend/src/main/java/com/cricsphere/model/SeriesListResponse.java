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
public class SeriesListResponse {

    @JsonProperty("status")
    private String status;

    @Builder.Default
    @JsonProperty("data")
    private List<Series> data = new ArrayList<>();

    /**
     * Helper to verify if the list contains any series.
     * Logs the count to verify API success in Render logs.
     */
    public boolean hasSeries() {
        boolean exists = data != null && !data.isEmpty();
        if (exists) {
            log.info("Successfully loaded {} cricket series into the cache.", data.size());
        } else {
            log.warn("SeriesListResponse status is '{}' but the series list is empty.", status);
        }
        return exists;
    }
}