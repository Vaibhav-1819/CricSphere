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
@JsonIgnoreProperties(ignoreUnknown = true) // Prevents crashes if the API adds new fields
public class Country {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("genericFlag")
    private String genericFlag;
    
    /**
     * Helper to get the full URL if genericFlag only contains the image name
     */
    public String getFlagUrl() {
        if (genericFlag == null) return null;
        // Example logic if the API only returns "in.png"
        return "https://static.cricsphere.com/flags/" + genericFlag;
    }
}