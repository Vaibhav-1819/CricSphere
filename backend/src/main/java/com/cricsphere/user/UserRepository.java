package com.cricsphere.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find a user by their username (used during login)
    Optional<User> findByUsername(String username);
    
    // Check if a username already exists during registration
    Boolean existsByUsername(String username);
}