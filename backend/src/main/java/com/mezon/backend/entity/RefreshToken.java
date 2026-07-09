package com.mezon.backend.entity;

public record RefreshToken(
        Long id,
        Long userId,
        String tokenHash,
        Long expiresAt,
        Long revokedAt,
        Long createdAt) {

    public boolean isActive(long now) {
        return revokedAt == null && expiresAt != null && expiresAt > now;
    }
}
