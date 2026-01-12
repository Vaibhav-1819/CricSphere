package com.cricsphere.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthUserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String favoriteTeam;
}
