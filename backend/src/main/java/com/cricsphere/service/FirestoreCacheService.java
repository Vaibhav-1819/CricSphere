package com.cricsphere.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class FirestoreCacheService {

    private static final String COLLECTION = "api_cache";

    private Firestore db() {
        return FirestoreClient.getFirestore();
    }

    public CacheEntry get(String key) {
        try {
            var doc = db().collection(COLLECTION).document(toDocId(key)).get().get();
            if (!doc.exists()) return null;

            String body = doc.getString("body");
            Long expiresAt = doc.getLong("expiresAt");

            if (body == null || expiresAt == null) return null;

            return new CacheEntry(body, expiresAt);

        } catch (Exception e) {
            log.warn("⚠️ Firestore cache read failed: {}", e.getMessage());
            return null;
        }
    }

    public void set(String key, String body, long ttlMillis) {
        try {
            long expiresAt = System.currentTimeMillis() + ttlMillis;

            Map<String, Object> data = new HashMap<>();
            data.put("body", body);
            data.put("expiresAt", expiresAt);
            data.put("updatedAt", Instant.now().toString());

            db().collection(COLLECTION).document(toDocId(key)).set(data);
        } catch (Exception e) {
            log.warn("⚠️ Firestore cache write failed: {}", e.getMessage());
        }
    }

    public boolean isExpired(CacheEntry entry) {
        return entry == null || System.currentTimeMillis() > entry.expiresAt;
    }

    // Firestore doc IDs can't safely contain URLs, so hash it
    private String toDocId(String key) {
        return Integer.toHexString(key.hashCode());
    }

    @Data
    @AllArgsConstructor
    public static class CacheEntry {
        private String body;
        private long expiresAt;
    }
}
