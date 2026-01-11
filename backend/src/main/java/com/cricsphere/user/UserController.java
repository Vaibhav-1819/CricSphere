package com.cricsphere.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        UserProfileDto profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto updateData) {
        String username = getCurrentUsername();
        
        // Pass the username (secured via JWT) and the new data to the service
        UserProfileDto updatedProfile = userService.updateUserProfile(username, updateData);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Helper to extract the username from the SecurityContext.
     * In a JWT-based app, the 'Name' in the Authentication object 
     * is the username extracted from the token.
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return authentication.getName();
    }
}