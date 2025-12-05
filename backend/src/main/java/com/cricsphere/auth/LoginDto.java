package com.cricsphere.auth;

import lombok.Data;

@Data
public class LoginDto {
    private String username;
    private String password;
}