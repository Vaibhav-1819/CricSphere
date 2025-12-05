package com.cricsphere.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Data
public class CountryListResponse {
    @JsonProperty("status")
    private String status;
    @JsonProperty("data")
    private List<Country> data;
}