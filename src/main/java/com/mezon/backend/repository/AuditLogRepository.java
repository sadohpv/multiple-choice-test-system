package com.mezon.backend.repository;

import com.mezon.backend.entity.AuditLog;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public class AuditLogRepository {

    private final JdbcTemplate jdbcTemplate;

    public AuditLogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(AuditLog log) {
        String sql = """
                INSERT INTO "AuditLogs" (user_id, username, action, target_type, target_id, detail, "createdAt")
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;
        jdbcTemplate.update(sql,
                log.getUserId(),
                log.getUsername(),
                log.getAction(),
                log.getTargetType(),
                log.getTargetId(),
                log.getDetail(),
                Instant.now().toEpochMilli());
    }

    public List<AuditLog> findAll(int limit, int offset) {
        String sql = """
                SELECT * FROM "AuditLogs"
                ORDER BY "createdAt" DESC
                LIMIT ? OFFSET ?
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AuditLog log = new AuditLog();
            log.setId(rs.getLong("id"));
            log.setUserId(rs.getLong("user_id"));
            log.setUsername(rs.getString("username"));
            log.setAction(rs.getString("action"));
            log.setTargetType(rs.getString("target_type"));
            log.setTargetId(rs.getString("target_id"));
            log.setDetail(rs.getString("detail"));
            log.setCreatedAt(rs.getLong("createdAt"));
            return log;
        }, limit, offset);
    }
}
