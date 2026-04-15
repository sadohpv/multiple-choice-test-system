package com.mezon.backend.repository;

import com.mezon.backend.entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> rowMapper = (rs, rowNum) -> new User(
            rs.getLong("id"),
            rs.getString("username"),
            rs.getString("avatar"),
            rs.getString("password"),
            rs.getString("email"),
            rs.getLong("createdAt"),
            rs.getLong("updatedAt"));

    public List<User> findAll() {
        String sql = "SELECT * FROM \"Users\"";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM \"Users\" WHERE id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public int save(User user) {
        String sql = "INSERT INTO \"Users\" (username, avatar, password, email, \"createdAt\", \"updatedAt\") VALUES (?, ?, ?, ?, ?, ?)";
        long currentTime = Instant.now().toEpochMilli();
        return jdbcTemplate.update(sql, user.username(), user.avatar(), user.password(), user.email(), currentTime,
                currentTime);
    }

    public int update(Long id, User user) {
        String sql = "UPDATE \"Users\" SET username = ?, avatar = ?, password = ?, email = ?, \"updatedAt\" = ? WHERE id = ?";
        long currentTime = Instant.now().toEpochMilli();
        return jdbcTemplate.update(sql, user.username(), user.avatar(), user.password(), user.email(), currentTime, id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Users\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}