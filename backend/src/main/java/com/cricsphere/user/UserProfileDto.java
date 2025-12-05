package com.cricsphere.user;

import lombok.Data;

@Data
public class UserProfileDto {
    private String username;
    private String email;
    private String role;
    
    // Add this field so the frontend can read the saved team
    private String favoriteTeam;
}