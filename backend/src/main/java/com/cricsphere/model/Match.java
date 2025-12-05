package com.cricsphere.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class Match {

    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("matchType")
    private String matchType;
    @JsonProperty("status")
    private String status;
    @JsonProperty("venue")
    private String venue;
    @JsonProperty("date")
    private String date;
}