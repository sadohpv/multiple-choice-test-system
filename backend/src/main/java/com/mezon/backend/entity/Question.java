package com.mezon.backend.entity;

import java.sql.ResultSet;
import java.sql.SQLException;

public record Question(
        Long id,
        String description,
        String content,
        String type,
        Long createdAt,
        Long updatedAt,
        Integer difficult,
        Long subjectId) {
    public Question {
        if (description == null) {
            throw new IllegalArgumentException("description cannot be null");
        }
        if (subjectId == null) {
            throw new IllegalArgumentException("subjectId cannot be null");
        }
    }

    public Question(ResultSet rs) throws SQLException {
        this(
                rs.getLong("id"),
                rs.getString("description"),
                rs.getString("content"),
                rs.getString("type"),
                rs.getLong("created_at"),
                rs.getLong("updated_at"),
                rs.getInt("difficult"),
                rs.getLong("subject_id"));
    }

    public static Question of(String description, Long subjectId) {
        return new Question(null, description, null, "MULTIPLE_CHOICE", null, null, null, subjectId);
    }
}
