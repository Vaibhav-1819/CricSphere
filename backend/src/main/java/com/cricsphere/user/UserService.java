package com.cricsphere.user;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        UserProfileDto dto = new UserProfileDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        
        // --- NEW: Map the favorite team to the DTO ---
        dto.setFavoriteTeam(user.getFavoriteTeam());
        
        return dto;
    }

    // --- NEW: Method to handle updates ---
    public UserProfileDto updateUserProfile(String username, UserProfileDto updateData) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Update fields if they are present in the request
        if (updateData.getFavoriteTeam() != null) {
            user.setFavoriteTeam(updateData.getFavoriteTeam());
        }

        // Save changes to Database
        User savedUser = userRepository.save(user);

        // Convert back to DTO to return to frontend
        UserProfileDto dto = new UserProfileDto();
        dto.setUsername(savedUser.getUsername());
        dto.setEmail(savedUser.getEmail());
        dto.setRole(savedUser.getRole());
        dto.setFavoriteTeam(savedUser.getFavoriteTeam());

        return dto;
    }
}