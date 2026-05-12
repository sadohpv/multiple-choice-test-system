package com.mezon.backend.repository;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.mezon.backend.dto.QuestionRequest;
import com.mezon.backend.entity.Question;

@Repository
public class QuestionRepository {

    private final JdbcTemplate jdbcTemplate;

    public QuestionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Question> rowMapper = (rs, rowNum) -> new Question(
            rs.getLong("id"),
            rs.getString("description"),
            rs.getString("content"),
            rs.getString("type"),
            rs.getLong("createdAt"),
            rs.getLong("updatedAt"),
            getInteger(rs, "difficult"),
            rs.getLong("subject_id"));

    private static Integer getInteger(java.sql.ResultSet rs, String column) throws java.sql.SQLException {
        int val = rs.getInt(column);
        return rs.wasNull() ? null : val;
    }

    public List<Question> findAll() {
        String sql = "SELECT * FROM \"Questions\"";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Question> findById(Long id) {
        String sql = "SELECT * FROM \"Questions\" WHERE id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public Question save(QuestionRequest question) {
        System.out.print(question);
        String sql = "INSERT INTO \"Questions\" (description, content, type, \"createdAt\", \"updatedAt\", difficult, subject_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        long currentTime = System.currentTimeMillis();

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, question.description());
            ps.setString(2, question.content());
            ps.setString(3, question.type());
            ps.setLong(4, currentTime);
            ps.setLong(5, currentTime);
            if (question.difficult() != null) {
                ps.setInt(6, question.difficult());
            } else {
                ps.setNull(6, java.sql.Types.INTEGER);
            }
            ps.setLong(7, question.subjectId());
            return ps;
        }, keyHolder);

        Long newId = ((Number) keyHolder.getKeys().get("id")).longValue();
        return new Question(newId, question.description(), question.content(), question.type(),
                currentTime, currentTime, question.difficult(), question.subjectId());
    }

    public int update(Long id, Question question) {
        String sql = "UPDATE \"Questions\" SET description = ?, content = ?, type = ?, \"updatedAt\" = ?, difficult = ?, subject_id = ? WHERE id = ?";
        long currentTime = System.currentTimeMillis();
        return jdbcTemplate.update(sql, question.description(), question.content(), question.type(),
                currentTime, question.difficult(), question.subjectId(), id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Questions\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(id) FROM \"Questions\" WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }
}
