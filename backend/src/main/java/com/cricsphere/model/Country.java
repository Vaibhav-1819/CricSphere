package com.cricsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) 
public class Country {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("genericFlag")
    private String genericFlag;
    
    /**
     * Helper to get the full URL if genericFlag only contains the image name.
     * Log a warning if the flag is missing to help with frontend UI debugging.
     */
    public String getFlagUrl() {
        if (genericFlag == null) {
            log.warn("Flag missing for country: {}", name);
            return null;
        }
        return "https://static.cricsphere.com/flags/" + genericFlag;
    }
}