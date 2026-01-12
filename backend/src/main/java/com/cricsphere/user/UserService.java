package com.cricsphere.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Returns the logged-in user's profile.
     */
    public UserProfileDto getUserProfile(String username) {
        log.debug("Fetching profile for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username)
                );

        return mapToDto(user);
    }

    /**
     * Updates only allowed profile fields.
     */
    @Transactional
    public UserProfileDto updateUserProfile(String username, UserProfileUpdateDto updateData) {
        log.info("Processing profile update for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username)
                );

        // Only editable field
        if (updateData.getFavoriteTeam() != null) {
            user.setFavoriteTeam(updateData.getFavoriteTeam());
        }

        return mapToDto(user);
    }

    /**
     * Entity → DTO mapping
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
