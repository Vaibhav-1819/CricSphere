package com.cricsphere.auth;

import com.cricsphere.user.User;
import com.cricsphere.user.UserRepository;
import com.cricsphere.util.JwtUtils;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    /* =========================
       REGISTER
    ========================== */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto registerDto) {
        log.info("Attempting to register user: {}", registerDto.getUsername());

        if (userRepository.existsByUsername(registerDto.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Username already exists"));
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Email already in use"));
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role("USER")
                .favoriteTeam(registerDto.getFavoriteTeam())
                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    /* =========================
       LOGIN (PRODUCTION GRADE)
    ========================== */
    @PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
    try {
        log.info("Login attempt for user: {}", loginDto.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken(authentication);

        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthUserResponse safeUser = AuthUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .favoriteTeam(user.getFavoriteTeam())
                .build();

        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "user", safeUser
        ));

    } catch (BadCredentialsException e) {
        log.warn("Invalid login for user: {}", loginDto.getUsername());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
    }
}