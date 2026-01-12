package com.cricsphere;

import com.cricsphere.user.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetProfileMapping() {
        // Arrange
        User mockUser = User.builder()
                .username("cricket_fan")
                .email("test@cricsphere.com")
                .favoriteTeam("India")
                .role("USER")
                .build();

        when(userRepository.findByUsername("cricket_fan"))
                .thenReturn(Optional.of(mockUser));

        // Act
        UserProfileDto result = userService.getUserProfile("cricket_fan");

        // Assert
        assertEquals("India", result.getFavoriteTeam());
        assertEquals("cricket_fan", result.getUsername());
        assertEquals("test@cricsphere.com", result.getEmail());
        assertEquals("USER", result.getRole());
    }
}
