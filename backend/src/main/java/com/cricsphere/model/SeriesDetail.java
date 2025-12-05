package com.cricsphere.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Data
public class SeriesDetail {
    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("startDate")
    private String startDate;
    @JsonProperty("endDate")
    private String endDate;
    @JsonProperty("odi")
    private int odi;
    @JsonProperty("t20")
    private int t20;
    @JsonProperty("test")
    private int test;
    @JsonProperty("matchList")
    private List<Match> matchList;
}