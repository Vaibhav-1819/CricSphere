package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

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
     * Helper method to check if the API call was successful 
     * based on the status string.
     */
    public boolean isSuccess() {
        return "success".equalsIgnoreCase(this.status) || "ok".equalsIgnoreCase(this.status);
    }
}