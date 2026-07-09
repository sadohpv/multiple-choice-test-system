package com.mezon.backend.security;

import java.util.List;

public record JwtClaims(
        Long userId,
        String username,
        String email,
        long expiresAt,
        List<String> roles) {
}
