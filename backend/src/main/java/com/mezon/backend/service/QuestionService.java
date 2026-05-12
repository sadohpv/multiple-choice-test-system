package com.mezon.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import com.mezon.backend.dto.ParsedQuestionDTO;
import com.mezon.backend.dto.QuestionRequest;
import com.mezon.backend.dto.QuestionResponse;
import com.mezon.backend.entity.Answer;
import com.mezon.backend.entity.Question;
import com.mezon.backend.repository.AnswerRepository;
import com.mezon.backend.repository.QuestionRepository;

@Service
public class QuestionService {

    private final AnswerService answerService;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final TransactionTemplate transactionTemplate;

    public QuestionService(QuestionRepository questionRepository,
            AnswerRepository answerRepository,
            TransactionTemplate transactionTemplate, AnswerService answerService) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.transactionTemplate = transactionTemplate;
        this.answerService = answerService;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question createQuestion(QuestionRequest question) {
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
                    question.subjectId());
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
                QuestionRequest question = new QuestionRequest(
                        dto.getQuestion(),
                        dto.getQuestion(),
                        "MULTIPLE_CHOICE",
                        parseDifficultyLevel(dto.getDifficulty()),
                        dto.getSubjectId() != null ? dto.getSubjectId() : 1L,
                        List.of() // hoặc danh sách answers thực tế
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
                                null);
                        answerRepository.save(answer);
                    }
                }
                savedCount++;
            }
            return savedCount;
        });
    }

    private Integer parseDifficultyLevel(String difficulty) {
        if (difficulty == null)
            return 2;
        return switch (difficulty.toUpperCase().trim()) {
            case "EASY", "DỄ", "DE", "1" -> 1;
            case "HARD", "KHO", "KHÓ", "3" -> 3;
            default -> 2;
        };
    }

    public QuestionResponse createOneQuestion(QuestionRequest questionRequest) {

        QuestionRequest request = new QuestionRequest(
                questionRequest.description(),
                questionRequest.description(),
                "MULTIPLE_CHOICE",
                questionRequest.difficult(),
                questionRequest.subjectId(), List.of());

        Question question = questionRepository.save(request);

        if (question.id() == null) {
            throw new RuntimeException("Failed to create question");
        }

        List<Answer> answers = answerService.saveAllAnswers(
                question.id(),
                questionRequest.answers());

        return new QuestionResponse(question, answers);
    }
}
