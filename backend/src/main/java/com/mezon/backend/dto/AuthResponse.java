package com.mezon.backend.dto;

public record AuthResponse(
        String tokenType,
        String accessToken,
        long expiresIn,
        String refreshToken,
        UserResponse user) {

    public static AuthResponse bearer(String accessToken, long expiresIn, String refreshToken, UserResponse user) {
        return new AuthResponse("Bearer", accessToken, expiresIn, refreshToken, user);
    }
}
