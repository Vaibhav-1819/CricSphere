package com.cricsphere;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@Slf4j
@SpringBootApplication
@EnableScheduling // Enables the @Scheduled background tasks in CricketService
public class CricsphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(CricsphereApplication.class, args);
        log.info("Cricsphere Backend is running successfully on http://localhost:8080");
    }

    /**
     * Centralized RestTemplate bean used by CricketService 
     * to fetch data from external cricket APIs.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}