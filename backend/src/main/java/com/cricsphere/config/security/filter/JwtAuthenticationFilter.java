package com.cricsphere.config.security.filter;

import com.cricsphere.util.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Get JWT from request header
        String token = getJwtFromRequest(request);

        // 2. Validate token and authenticate user
        if (StringUtils.hasText(token) && jwtUtils.validateToken(token)) {
            
            // Get username from token
            String username = jwtUtils.getUsernameFromToken(token);

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Authenticate user
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );

            // Set authentication details (IP address, session ID, etc.)
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // Set security context: This is where the magic happens!
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continue to the next filter in the chain (or the controller)
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        // Check if the Authorization header contains the Bearer token
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Extract the token (skipping "Bearer ")
        }
        return null;
    }
}