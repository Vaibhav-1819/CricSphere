package com.cricsphere.user;

import lombok.Data;

/**
 * Only fields that a user is allowed to edit.
 */
@Data
public class UserProfileUpdateDto {
    private String favoriteTeam;
}
