package com.cricsphere.config.security;

import com.cricsphere.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("🔍 Loading user details for username: {}", username);

        com.cricsphere.user.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("❌ User not found in database: {}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });

        // Format the role safely to ensure it starts with ROLE_ exactly once
        String roleName = user.getRole().toUpperCase();
        String formattedRole = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

        log.debug("✅ User found. Assigning authority: {}", formattedRole);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(formattedRole))
        );
    }
}