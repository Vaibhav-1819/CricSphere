package com.cricsphere.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*; // Added PutMapping & RequestBody

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserProfileDto getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.getUserProfile(username);
    }

    // --- NEW ENDPOINT FOR SAVING DATA ---
    @PutMapping("/profile")
    public UserProfileDto updateProfile(@RequestBody UserProfileDto updateData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Pass the username (from token) and the data (from frontend) to service
        return userService.updateUserProfile(username, updateData);
    }
}