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
public class SeriesDetailResponse {

    @JsonProperty("status")
    private String status;

    @JsonProperty("data")
    private SeriesDetail data;

    /**
     * Helper to verify if the series data was successfully retrieved.
     * Logs a warning if the API call was not successful.
     */
    public boolean isSuccess() {
        boolean success = "success".equalsIgnoreCase(status) && data != null;
        if (!success) {
            log.warn("Series detail retrieval failed or returned null data. Status: {}", status);
        }
        return success;
    }
}