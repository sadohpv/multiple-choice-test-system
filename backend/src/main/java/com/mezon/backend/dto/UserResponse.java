package com.mezon.backend.dto;

import com.mezon.backend.entity.User;

public record UserResponse(
        Long id,
        String username,
        String displayname,
        String avatar,
        String email,
        Long createdAt,
        Long updatedAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.id(), user.username(), user.displayname(),
                user.avatar(), user.email(), user.createdAt(), user.updatedAt());
    }
}