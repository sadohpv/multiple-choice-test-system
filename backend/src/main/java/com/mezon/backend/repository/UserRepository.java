package com.mezon.backend.repository;

import com.mezon.backend.entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private static final String USER_COLUMNS = """
            id, username, displayname, avatar, password, email, "createdAt", "updatedAt"
            """;

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
            nullableLong(rs, "createdAt"),
            nullableLong(rs, "updatedAt"));

    public List<User> findAll() {
        String sql = "SELECT " + USER_COLUMNS + " FROM \"Users\"";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT " + USER_COLUMNS + " FROM \"Users\" WHERE id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public Optional<User> findByUsernameOrEmail(String identity) {
        String sql = "SELECT " + USER_COLUMNS + " FROM \"Users\" WHERE username = ? OR LOWER(email) = LOWER(?)";
        return jdbcTemplate.query(sql, rowMapper, identity, identity).stream().findFirst();
    }

    // Legacy plaintext lookup kept unused while auth migrates to BCrypt matching in UserService.
    @Deprecated
    public Optional<User> findByUsernameOrEmailAndPassword(String identity, String password) {
        String sql = "SELECT " + USER_COLUMNS + " FROM \"Users\" WHERE (username = ? OR email = ?) AND password = ?";
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

    public int updatePassword(Long id, String encodedPassword) {
        String sql = "UPDATE \"Users\" SET password = ?, \"updatedAt\" = ? WHERE id = ?";
        return jdbcTemplate.update(sql, encodedPassword, Instant.now().toEpochMilli(), id);
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
        String sql = "SELECT COUNT(id) FROM \"Users\" WHERE LOWER(email) = LOWER(?)";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    private Long nullableLong(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}
