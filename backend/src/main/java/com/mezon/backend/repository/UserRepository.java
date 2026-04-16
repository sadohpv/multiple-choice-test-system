package com.mezon.backend.repository;

import com.mezon.backend.entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
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

    public User save(User user) {
        String sql = "INSERT INTO \"Users\" (username, displayname, avatar, password, email, \"createdAt\", \"updatedAt\") VALUES (?, ?, ?, ?, ?, ?, ?)";

        // get current time ms
        long currentTime = Instant.now().toEpochMilli();

        // use keyholder get id from postgresql
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            // request db return generated keys
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.username());
            ps.setString(2, user.displayname());
            ps.setString(3, user.avatar());
            ps.setString(4, user.password());
            ps.setString(5, user.email());
            ps.setLong(6, currentTime);
            ps.setLong(7, currentTime);
            return ps;
        }, keyHolder);

        // extract id value
        Long newId = ((Number) keyHolder.getKeys().get("id")).longValue();
        return new User(newId, user.username(), user.displayname(), user.avatar(), user.password(), user.email(),
                currentTime, currentTime);
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