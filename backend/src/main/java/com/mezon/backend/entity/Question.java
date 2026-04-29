package com.mezon.backend.entity;
public record Question(
        Long id,
        String description,
        String content,
        String type,
        Long createdAt,
        Long updatedAt,
        Integer difficult,
        Long subjectId
) {
    public Question {
        if (description == null) {
            throw new IllegalArgumentException("description cannot be null");
        }
        if (subjectId == null) {
            throw new IllegalArgumentException("subjectId cannot be null");
        }
    }

    public static Question of(String description, Long subjectId) {
        return new Question(null, description, null, "MULTIPLE_CHOICE", null, null, null, subjectId);
    }
}
