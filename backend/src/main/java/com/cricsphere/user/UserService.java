package com.cricsphere.user;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves user details and converts them to a DTO for the frontend.
     */
    public UserProfileDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return mapToDto(user);
    }

    /**
     * Updates specific user preferences. 
     * @Transactional ensures the database connection is handled safely.
     */
    @Transactional
    public UserProfileDto updateUserProfile(String username, UserProfileDto updateData) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Update specific allowed fields
        if (updateData.getFavoriteTeam() != null) {
            user.setFavoriteTeam(updateData.getFavoriteTeam());
        }
        
        // You could also allow email updates here if desired
        // if (updateData.getEmail() != null) { user.setEmail(updateData.getEmail()); }

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    /**
     * Helper method to centralize the Entity -> DTO mapping logic.
     */
    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .favoriteTeam(user.getFavoriteTeam())
                .build();
    }
}