package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Raw DTO for CricAPI / Cricbuzz player list responses.
 * Must stay pure.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerListResponse {

    @JsonProperty("status")
    private String status;

    // Some endpoints return players as "player", others as "data"
    @JsonProperty("player")
    private List<Player> player;

    @JsonProperty("data")
    private List<Player> data;
}
