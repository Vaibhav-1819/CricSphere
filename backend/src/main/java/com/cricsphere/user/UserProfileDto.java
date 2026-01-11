package com.cricsphere.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    // Usually read-only in the UI
    private String username;

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    // Usually read-only for security reasons
    private String role;
    
    // The editable preference field
    private String favoriteTeam;
}