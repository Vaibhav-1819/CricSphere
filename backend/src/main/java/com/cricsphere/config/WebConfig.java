package com.cricsphere.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") 
                // ✅ Updated to allow both local dev and Vercel production
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "https://*.vercel.app"
                ) 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization") // Required for frontend to read the JWT
                .allowCredentials(true)
                .maxAge(3600); 
    }
}