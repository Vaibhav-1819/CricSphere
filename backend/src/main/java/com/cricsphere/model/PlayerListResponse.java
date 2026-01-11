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
public class PlayerListResponse {

    @JsonProperty("status")
    private String status;

    @Builder.Default
    @JsonProperty("data")
    private List<Player> data = new ArrayList<>();

    /**
     * Utility to quickly check if players were found.
     * Logs the size of the player list for monitoring.
     */
    public boolean hasData() {
        boolean exists = data != null && !data.isEmpty();
        if (exists) {
            log.info("Successfully loaded {} players into the list response.", data.size());
        } else {
            log.warn("PlayerListResponse received with status '{}' but contains no player data.", status);
        }
        return exists;
    }
}