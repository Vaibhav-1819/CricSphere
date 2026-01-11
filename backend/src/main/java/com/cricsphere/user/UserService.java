package com.cricsphere.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor // ✅ Replaces manual constructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Retrieves user details and converts them to a DTO for the frontend.
     */
    public UserProfileDto getUserProfile(String username) {
        log.debug("Fetching profile for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return mapToDto(user);
    }

    /**
     * Updates specific user preferences. 
     */
    @Transactional
    public UserProfileDto updateUserProfile(String username, UserProfileDto updateData) {
        log.info("Processing profile update for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Update specific allowed fields
        if (updateData.getFavoriteTeam() != null) {
            user.setFavoriteTeam(updateData.getFavoriteTeam());
            log.debug("User {} updated favorite team to: {}", username, updateData.getFavoriteTeam());
        }

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    /**
     * Helper method using the Builder pattern established in Step 2 & 3.
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