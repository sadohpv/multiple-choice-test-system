package com.mezon.backend.entity;
public record Answer(
        Long id,
        String description,
        Long questionId,
        Boolean valid,
        Long createdAt,
        Long updatedAt
) {
    public Answer {
        if (description == null) {
            throw new IllegalArgumentException("description cannot be null");
        }
        if (questionId == null) {
            throw new IllegalArgumentException("questionId cannot be null");
        }
        if (valid == null) {
            valid = false;
        }
    }

    public static Answer of(String description, Long questionId, Boolean valid) {
        return new Answer(null, description, questionId, valid, null, null);
    }
}
