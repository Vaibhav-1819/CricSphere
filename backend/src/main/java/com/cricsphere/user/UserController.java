package com.cricsphere.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile() {
        String username = getCurrentUsername();
        log.info("Fetching profile for user: {}", username);
        
        UserProfileDto profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto updateData) {
        String username = getCurrentUsername();
        log.info("Updating profile for user: {}", username);
        
        UserProfileDto updatedProfile = userService.updateUserProfile(username, updateData);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Helper to extract the username from the SecurityContext.
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.error("Security Context violation: No authenticated user found");
            throw new RuntimeException("No authenticated user found");
        }
        return authentication.getName();
    }
}