package com.cricsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling; // Import added
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling // <-- THIS LINE ACTIVATES THE TIMER SYSTEM
public class CricsphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(CricsphereApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}