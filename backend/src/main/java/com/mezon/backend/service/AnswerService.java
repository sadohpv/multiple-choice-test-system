package com.mezon.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mezon.backend.dto.AnswerRequest;
import com.mezon.backend.entity.Answer;
import com.mezon.backend.repository.AnswerRepository;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public Optional<Answer> getAnswerById(Long id) {
        return answerRepository.findById(id);
    }

    public List<Answer> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public Answer createAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

    public boolean updateAnswer(Long id, Answer answer) {
        Optional<Answer> existing = answerRepository.findById(id);
        if (existing.isPresent()) {
            Answer updated = new Answer(
                    id,
                    answer.description(),
                    answer.questionId(),
                    answer.valid(),
                    existing.get().createdAt(),
                    System.currentTimeMillis());
            answerRepository.update(id, updated);
            return true;
        }
        return false;
    }

    public boolean deleteAnswer(Long id) {
        if (answerRepository.existsById(id)) {
            answerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Answer> saveAllAnswers(Long question_id, List<AnswerRequest> answers) {
        return answerRepository.saveAll(question_id, answers);
    }
}
