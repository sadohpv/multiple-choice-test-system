package com.mezon.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.nio.charset.StandardCharsets;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        long accessTokenExpirationMs,
        long refreshTokenExpirationMs) {

    public JwtProperties {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET is required");
        }
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 bytes");
        }
        if (accessTokenExpirationMs <= 0) {
            throw new IllegalStateException("Access token expiration must be positive");
        }
        if (refreshTokenExpirationMs <= accessTokenExpirationMs) {
            throw new IllegalStateException("Refresh token expiration must be longer than access token expiration");
        }
    }
}
