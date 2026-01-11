package com.cricsphere;

import com.cricsphere.user.*;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UserProfileTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetProfileMapping() {
        // Arrange: Create a fake user in the database
        User mockUser = User.builder()
                .username("cricket_fan")
                .email("test@cricsphere.com")
                .favoriteTeam("India")
                .role("USER")
                .build();

        when(userRepository.findByUsername("cricket_fan")).thenReturn(Optional.of(mockUser));

        // Act: Call the service
        UserProfileDto result = userService.getUserProfile("cricket_fan");

        // Assert: Verify the mapping logic works
        assertEquals("India", result.getFavoriteTeam());
        assertEquals("cricket_fan", result.getUsername());
    }
}