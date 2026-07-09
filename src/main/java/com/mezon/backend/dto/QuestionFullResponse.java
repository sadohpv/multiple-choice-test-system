package com.mezon.backend.dto;

import java.util.List;

public class QuestionFullResponse {
    private Long id;
    private String content;
    private String description;
    private Integer difficult;
    private String type;
    private Long subjectId;
    private Long createdAt;
    private Long updatedAt;
    private List<AnswerFullResponse> answers; // Chứa danh sách câu trả lời gộp vào đây

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDifficult() { return difficult; }
    public void setDifficult(Integer difficult) { this.difficult = difficult; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public Long getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Long updatedAt) { this.updatedAt = updatedAt; }

    public List<AnswerFullResponse> getAnswers() { return answers; }
    public void setAnswers(List<AnswerFullResponse> answers) { this.answers = answers; }
}