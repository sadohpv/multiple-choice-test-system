package com.mezon.backend.repository;

import com.mezon.backend.entity.RefreshToken;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Optional;

@Repository
public class RefreshTokenRepository {

    private static final String REFRESH_TOKEN_COLUMNS = """
            id, user_id, token_hash, expires_at, revoked_at, created_at
            """;

    private final JdbcTemplate jdbcTemplate;

    public RefreshTokenRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<RefreshToken> rowMapper = (rs, rowNum) -> new RefreshToken(
            rs.getLong("id"),
            rs.getLong("user_id"),
            rs.getString("token_hash"),
            nullableLong(rs, "expires_at"),
            nullableLong(rs, "revoked_at"),
            nullableLong(rs, "created_at"));

    public RefreshToken save(Long userId, String tokenHash, long expiresAt) {
        long now = Instant.now().toEpochMilli();
        String sql = """
                INSERT INTO auth_refresh_tokens (user_id, token_hash, expires_at, created_at)
                VALUES (?, ?, ?, ?)
                RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at
                """;

        return jdbcTemplate.queryForObject(sql, rowMapper, userId, tokenHash, expiresAt, now);
    }

    public Optional<RefreshToken> findByTokenHash(String tokenHash) {
        String sql = "SELECT " + REFRESH_TOKEN_COLUMNS + " FROM auth_refresh_tokens WHERE token_hash = ?";
        return jdbcTemplate.query(sql, rowMapper, tokenHash).stream().findFirst();
    }

    public int revokeById(Long id) {
        String sql = "UPDATE auth_refresh_tokens SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL";
        return jdbcTemplate.update(sql, Instant.now().toEpochMilli(), id);
    }

    public int revokeByTokenHash(String tokenHash) {
        String sql = "UPDATE auth_refresh_tokens SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL";
        return jdbcTemplate.update(sql, Instant.now().toEpochMilli(), tokenHash);
    }

    public int deleteExpiredBefore(long timestamp) {
        String sql = "DELETE FROM auth_refresh_tokens WHERE expires_at < ?";
        return jdbcTemplate.update(sql, timestamp);
    }

    private Long nullableLong(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}
