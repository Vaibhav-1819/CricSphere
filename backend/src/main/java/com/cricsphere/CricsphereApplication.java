package com.cricsphere;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@Slf4j
@SpringBootApplication
@EnableScheduling // Enables background tasks for live score updates
public class CricsphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(CricsphereApplication.class, args);
        log.info("🚀 Cricsphere Backend is live!");
        log.info("Local access: http://localhost:8080");
    }

    /**
     * Centralized RestTemplate bean. 
     * Managing this as a Bean is more efficient than creating 'new RestTemplate()' in every service.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}