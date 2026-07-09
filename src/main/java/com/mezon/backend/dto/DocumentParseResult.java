package com.mezon.backend.dto;
import java.util.List;

public class DocumentParseResult {

    private boolean success;
    private List<ParsedQuestionDTO> questions;
    private String message;
    private int totalParsed;

    public DocumentParseResult() {}

    public DocumentParseResult(boolean success, List<ParsedQuestionDTO> questions,
                               String message, int totalParsed) {
        this.success = success;
        this.questions = questions;
        this.message = message;
        this.totalParsed = totalParsed;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public List<ParsedQuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<ParsedQuestionDTO> questions) { this.questions = questions; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public int getTotalParsed() { return totalParsed; }
    public void setTotalParsed(int totalParsed) { this.totalParsed = totalParsed; }
}
