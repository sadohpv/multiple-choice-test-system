package com.mezon.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mezon.backend.config.JwtProperties;
import com.mezon.backend.entity.User;
import com.mezon.backend.security.JwtClaims;

@Service
public class JwtService {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final TypeReference<Map<String, Object>> CLAIMS_TYPE = new TypeReference<>() {
    };

    private final JwtProperties jwtProperties;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final byte[] signingKey;

    public JwtService(JwtProperties jwtProperties, ObjectMapper objectMapper) {
        this.jwtProperties = jwtProperties;
        this.objectMapper = objectMapper;
        this.clock = Clock.systemUTC();
        this.signingKey = jwtProperties.secret().getBytes(StandardCharsets.UTF_8);
    }

    public String createAccessToken(User user) {
        Instant now = Instant.now(clock);
        Instant expiresAt = now.plusMillis(jwtProperties.accessTokenExpirationMs());

        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.id().toString());
        payload.put("username", user.username());
        payload.put("email", user.email());
        payload.put("type", ACCESS_TOKEN_TYPE);
        payload.put("iat", now.getEpochSecond());
        payload.put("roles", "USER");
        payload.put("exp", expiresAt.getEpochSecond());

        String unsignedToken = encodeJson(header) + "." + encodeJson(payload);
        return unsignedToken + "." + sign(unsignedToken);
    }

    public Optional<JwtClaims> parseAccessToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return Optional.empty();
            }

            String unsignedToken = parts[0] + "." + parts[1];
            String expectedSignature = sign(unsignedToken);
            if (!MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.US_ASCII),
                    parts[2].getBytes(StandardCharsets.US_ASCII))) {
                return Optional.empty();
            }

            Map<String, Object> claims = objectMapper.readValue(decode(parts[1]), CLAIMS_TYPE);
            if (!ACCESS_TOKEN_TYPE.equals(claims.get("type"))) {
                return Optional.empty();
            }

            long expiresAt = asLong(claims.get("exp"));
            // if (expiresAt <= Instant.now(clock).getEpochSecond()) {
            // return Optional.empty();
            // }

            @SuppressWarnings("unchecked")
            List<String> roles = claims.get("roles") instanceof List<?> rawList
                    ? (List<String>) rawList
                    : Collections.emptyList();

            return Optional.of(new JwtClaims(
                    Long.valueOf(requiredString(claims.get("sub"))),
                    requiredString(claims.get("username")),
                    requiredString(claims.get("email")),
                    expiresAt,
                    List.of("ADMIN")));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    public long accessTokenExpiresInSeconds() {
        return jwtProperties.accessTokenExpirationMs() / 1000;
    }

    private String encodeJson(Map<String, Object> payload) {
        try {
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(objectMapper.writeValueAsBytes(payload));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to encode JWT payload", ex);
        }
    }

    private String sign(String unsignedToken) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(signingKey, HMAC_SHA256));
            byte[] signature = mac.doFinal(unsignedToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (NoSuchAlgorithmException | InvalidKeyException ex) {
            throw new IllegalStateException("Unable to sign JWT", ex);
        }
    }

    private String decode(String value) {
        return new String(Base64.getUrlDecoder().decode(value), StandardCharsets.UTF_8);
    }

    private long asLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            return Long.parseLong(text);
        }
        throw new IllegalArgumentException("JWT numeric claim is missing");
    }

    private String requiredString(Object value) {
        if (value instanceof String text && !text.isBlank()) {
            return text;
        }
        throw new IllegalArgumentException("JWT string claim is missing");
    }
}
