package com.mezon.backend.security;

public record JwtClaims(
        Long userId,
        String username,
        String email,
        long expiresAt) {
}
