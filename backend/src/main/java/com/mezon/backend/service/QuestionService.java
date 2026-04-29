package com.mezon.backend.service;
import com.mezon.backend.dto.ParsedQuestionDTO;
import com.mezon.backend.entity.Answer;
import com.mezon.backend.entity.Question;
import com.mezon.backend.repository.AnswerRepository;
import com.mezon.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final TransactionTemplate transactionTemplate;

    public QuestionService(QuestionRepository questionRepository,
                          AnswerRepository answerRepository,
                          TransactionTemplate transactionTemplate) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.transactionTemplate = transactionTemplate;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public boolean updateQuestion(Long id, Question question) {
        Optional<Question> existing = questionRepository.findById(id);
        if (existing.isPresent()) {
            Question updated = new Question(
                    id,
                    question.description(),
                    question.content(),
                    question.type(),
                    existing.get().createdAt(),
                    System.currentTimeMillis(),
                    question.difficult(),
                    question.subjectId()
            );
            questionRepository.update(id, updated);
            return true;
        }
        return false;
    }

    public boolean deleteQuestion(Long id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public int importQuestions(List<ParsedQuestionDTO> parsedQuestions) {
        return transactionTemplate.execute(status -> {
            int savedCount = 0;
            for (ParsedQuestionDTO dto : parsedQuestions) {
                Question question = new Question(
                        null,
                        dto.getQuestion(),
                        null,
                        "MULTIPLE_CHOICE",
                        null,
                        null,
                        parseDifficultyLevel(dto.getDifficulty()),
                        dto.getSubjectId() != null ? dto.getSubjectId() : 1L
                );

                Question saved = questionRepository.save(question);

                var options = dto.getOptions();
                if (options != null) {
                    for (int i = 0; i < options.size(); i++) {
                        Answer answer = new Answer(
                                null,
                                options.get(i).getContent(),
                                saved.id(),
                                dto.getCorrectIndex() != null && i == dto.getCorrectIndex(),
                                null,
                                null
                        );
                        answerRepository.save(answer);
                    }
                }
                savedCount++;
            }
            return savedCount;
        });
    }

    private Integer parseDifficultyLevel(String difficulty) {
        if (difficulty == null) return 2;
        return switch (difficulty.toUpperCase().trim()) {
            case "EASY", "DỄ", "DE", "1" -> 1;
            case "HARD", "KHO", "KHÓ", "3" -> 3;
            default -> 2;
        };
    }
}
