package com.mezon.backend.repository;
import com.mezon.backend.entity.Answer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class AnswerRepository {

    private final JdbcTemplate jdbcTemplate;

    public AnswerRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Answer> rowMapper = (rs, rowNum) -> new Answer(
            rs.getLong("id"),
            rs.getString("description"),
            rs.getLong("question_id"),
            rs.getBoolean("valid"),
            rs.getLong("createdAt"),
            rs.getLong("updatedAt"));

    public List<Answer> findAll() {
        String sql = "SELECT * FROM \"Answers\"";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Answer> findById(Long id) {
        String sql = "SELECT * FROM \"Answers\" WHERE id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<Answer> findByQuestionId(Long questionId) {
        String sql = "SELECT * FROM \"Answers\" WHERE question_id = ?";
        return jdbcTemplate.query(sql, rowMapper, questionId);
    }

    public Answer save(Answer answer) {
        String sql = "INSERT INTO \"Answers\" (description, question_id, valid, \"createdAt\", \"updatedAt\") VALUES (?, ?, ?, ?, ?)";
        long currentTime = System.currentTimeMillis();

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, answer.description());
            ps.setLong(2, answer.questionId());
            ps.setBoolean(3, answer.valid());
            ps.setLong(4, currentTime);
            ps.setLong(5, currentTime);
            return ps;
        }, keyHolder);

        Long newId = ((Number) keyHolder.getKeys().get("id")).longValue();
        return new Answer(newId, answer.description(), answer.questionId(), answer.valid(), currentTime, currentTime);
    }

    public int update(Long id, Answer answer) {
        String sql = "UPDATE \"Answers\" SET description = ?, question_id = ?, valid = ?, \"updatedAt\" = ? WHERE id = ?";
        long currentTime = System.currentTimeMillis();
        return jdbcTemplate.update(sql, answer.description(), answer.questionId(), answer.valid(), currentTime, id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Answers\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(id) FROM \"Answers\" WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }
}
