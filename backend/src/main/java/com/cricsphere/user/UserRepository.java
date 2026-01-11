package com.cricsphere.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Used for login and profile fetching
    Optional<User> findByUsername(String username);
    
    // Used to verify if a user exists by email
    Optional<User> findByEmail(String email);
    
    // Registration checks
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
}