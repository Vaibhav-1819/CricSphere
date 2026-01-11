package com.cricsphere.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Used for login, JWT authentication, and profile fetching
    Optional<User> findByUsername(String username);
    
    // Used for password recovery or email-based lookups
    Optional<User> findByEmail(String email);
    
    // Registration checks to prevent duplicate usernames
    Boolean existsByUsername(String username);
    
    // Registration checks to prevent duplicate emails
    Boolean existsByEmail(String email);
}