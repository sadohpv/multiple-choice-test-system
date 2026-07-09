package com.mezon.backend.service;

import com.mezon.backend.config.JwtProperties;
import com.mezon.backend.entity.RefreshToken;
import com.mezon.backend.exception.InvalidRefreshTokenException;
import com.mezon.backend.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private static final int REFRESH_TOKEN_BYTES = 64;

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               JwtProperties jwtProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProperties = jwtProperties;
        this.secureRandom = new SecureRandom();
    }

    public String createRefreshToken(Long userId) {
        String token = randomToken();
        long expiresAt = Instant.now().toEpochMilli() + jwtProperties.refreshTokenExpirationMs();
        refreshTokenRepository.save(userId, hash(token), expiresAt);
        return token;
    }

    public RefreshTokenRotation rotate(String rawToken) {
        RefreshToken refreshToken = requireActiveToken(rawToken);
        if (refreshTokenRepository.revokeById(refreshToken.id()) == 0) {
            throw new InvalidRefreshTokenException("Refresh token không còn hiệu lực");
        }

        String nextRefreshToken = createRefreshToken(refreshToken.userId());
        return new RefreshTokenRotation(refreshToken.userId(), nextRefreshToken);
    }

    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }
        refreshTokenRepository.revokeByTokenHash(hash(rawToken));
    }

    private RefreshToken requireActiveToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidRefreshTokenException("Refresh token là bắt buộc");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token không hợp lệ"));

        if (!refreshToken.isActive(Instant.now().toEpochMilli())) {
            throw new InvalidRefreshTokenException("Refresh token đã hết hạn hoặc đã bị thu hồi");
        }

        return refreshToken;
    }

    private String randomToken() {
        byte[] bytes = new byte[REFRESH_TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash refresh token", ex);
        }
    }

    public record RefreshTokenRotation(Long userId, String refreshToken) {
    }
}
