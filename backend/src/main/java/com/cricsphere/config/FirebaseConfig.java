package com.cricsphere.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        try {
            // Prevent double init
            if (!FirebaseApp.getApps().isEmpty()) {
                log.info("🔥 Firebase already initialized.");
                return;
            }

            String json = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
            if (json == null || json.isBlank()) {
                throw new IllegalStateException("FIREBASE_SERVICE_ACCOUNT_JSON env is missing");
            }

            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8))
            );

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("✅ Firebase initialized successfully.");

        } catch (Exception e) {
            log.error("❌ Firebase init failed: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
