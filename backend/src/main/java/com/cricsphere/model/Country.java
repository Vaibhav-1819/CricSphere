package com.cricsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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

    /**
     * Raw value coming from CricAPI.
     * Can be:
     * - full URL
     * - filename like "india.png"
     */
    @JsonProperty("genericFlag")
    private String genericFlag;

    /**
     * Computed absolute flag URL.
     * Exposed to frontend but never read from input JSON.
     */
    @JsonProperty(value = "flagUrl", access = Access.READ_ONLY)
    public String getFlagUrl() {
        if (genericFlag == null || genericFlag.isBlank()) {
            return null;
        }

        // Already a full URL
        if (genericFlag.startsWith("http")) {
            return genericFlag;
        }

        // Encode filename to avoid spaces & special chars breaking URLs
        String safeFile = URLEncoder.encode(genericFlag, StandardCharsets.UTF_8);

        // CricAPI CDN
        return "https://api.cricapi.com/v1/img/flags/" + safeFile;
    }
}
