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
            rs.getString("displayname"),
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

    public Optional<User> findByUsernameOrEmailAndPassword(String identity, String password) {
        String sql = "SELECT * FROM \"Users\" WHERE (username = ? OR email = ?) AND password = ?";
        return jdbcTemplate.query(sql, rowMapper, identity, identity, password).stream().findFirst();
    }

    public User save(User user) {
        long currentTime = Instant.now().toEpochMilli();
        String sql = """
                INSERT INTO "Users" (username, displayname, avatar, password, email, "createdAt", "updatedAt")
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING id, username, displayname, avatar, password, email, "createdAt", "updatedAt"
                """;

        return jdbcTemplate.queryForObject(
                sql,
                rowMapper,
                user.username(),
                user.displayname(),
                user.avatar(),
                user.password(),
                user.email(),
                currentTime,
                currentTime);
    }

    public int update(Long id, User user) {
        String sql = "UPDATE \"Users\" SET username = ?, displayname = ?, avatar = ?, password = ?, email = ?, \"updatedAt\" = ? WHERE id = ?";
        long currentTime = Instant.now().toEpochMilli();
        return jdbcTemplate.update(sql, user.username(), user.displayname(), user.avatar(), user.password(),
                user.email(), currentTime, id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Users\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(id) FROM \"Users\" WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(id) FROM \"Users\" WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }
}
