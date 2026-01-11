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
public class PlayerListResponse {

    @JsonProperty("status")
    private String status;

    @Builder.Default
    @JsonProperty("data")
    private List<Player> data = new ArrayList<>();

    /**
     * Utility to quickly check if players were found
     */
    public boolean hasData() {
        return data != null && !data.isEmpty();
    }
}