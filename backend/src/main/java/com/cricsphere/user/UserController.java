package com.cricsphere.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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

        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @RequestBody UserProfileUpdateDto updateData) {

        String username = getCurrentUsername();
        log.info("Updating profile for user: {}", username);

        return ResponseEntity.ok(
                userService.updateUserProfile(username, updateData)
        );
    }

    /**
     * Securely extract username from JWT-authenticated context.
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Unauthorized");
        }

        return authentication.getName();
    }
}
