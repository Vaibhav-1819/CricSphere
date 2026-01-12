package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Raw DTO for CricAPI country list response.
 * This class must stay pure (no logging, no logic).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CountryListResponse {

    @JsonProperty("status")
    private String status;

    @JsonProperty("data")
    private List<Country> data;

    @JsonProperty("info")
    private ApiInfo info;

    /**
     * Metadata returned by CricAPI.
     */
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ApiInfo {
        private Integer hitsToday;
        private Integer hitsUsed;
        private Integer hitsLimit;
    }
}
