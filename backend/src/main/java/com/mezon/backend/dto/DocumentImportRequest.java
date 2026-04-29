package com.mezon.backend.dto;
import java.util.List;

public class DocumentImportRequest {

    private List<ParsedQuestionDTO> questions;
    private Long subjectId;
    private String difficulty;

    public List<ParsedQuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<ParsedQuestionDTO> questions) { this.questions = questions; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
