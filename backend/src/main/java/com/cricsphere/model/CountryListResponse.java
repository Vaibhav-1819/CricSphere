package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Slf4j
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

    /**
     * Helper method to check if the API call was successful.
     * Logs a warning if the status is success but the list is null.
     */
    public boolean isSuccess() {
        boolean success = "success".equalsIgnoreCase(this.status) || "ok".equalsIgnoreCase(this.status);
        if (success && data == null) {
            log.warn("API returned success status but null data list.");
        }
        return success;
    }
}