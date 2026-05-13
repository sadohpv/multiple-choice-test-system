package com.mezon.backend.dto;

import com.mezon.backend.entity.User;
import java.util.List;

public record UserResponse(
        Long id,
        String username,
        String displayname,
        String avatar,
        String email,
        Long createdAt,
        Long updatedAt,
        List<String> roles) {
    public static UserResponse from(User user, List<String> roles) {
        return new UserResponse(
                user.id(),
                user.username(),
                user.displayname(),
                user.avatar(),
                user.email(),
                user.createdAt(),
                user.updatedAt(),
                roles // gán roles cho object trả về
        );
    }
}
