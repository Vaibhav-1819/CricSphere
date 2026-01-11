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
public class SeriesDetailResponse {

    @JsonProperty("status")
    private String status;

    @JsonProperty("data")
    private SeriesDetail data;

    /**
     * Helper to verify if the series data was successfully retrieved
     */
    public boolean isSuccess() {
        return "success".equalsIgnoreCase(status) && data != null;
    }
}