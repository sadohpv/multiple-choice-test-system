package com.mezon.backend.dto;
import java.util.List;

public class ParsedQuestionDTO {

    private String question;
    private List<AnswerOption> options;
    private Integer correctIndex;
    private String difficulty;
    private Long subjectId;

    public ParsedQuestionDTO() {}

    public ParsedQuestionDTO(String question, List<AnswerOption> options,
                              Integer correctIndex, String difficulty, Long subjectId) {
        this.question = question;
        this.options = options;
        this.correctIndex = correctIndex;
        this.difficulty = difficulty;
        this.subjectId = subjectId;
    }

    public static class AnswerOption {
        private String label;
        private String content;

        public AnswerOption() {}
        public AnswerOption(String label, String content) {
            this.label = label;
            this.content = content;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<AnswerOption> getOptions() { return options; }
    public void setOptions(List<AnswerOption> options) { this.options = options; }
    public Integer getCorrectIndex() { return correctIndex; }
    public void setCorrectIndex(Integer correctIndex) { this.correctIndex = correctIndex; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
}
