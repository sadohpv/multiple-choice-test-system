package com.mezon.backend.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mezon.backend.dto.QuestionRequest;
import com.mezon.backend.dto.QuestionResponse;
import com.mezon.backend.entity.Question;
import com.mezon.backend.service.QuestionService;


@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionRequest question) {
        Question created = questionService.createQuestion(question);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/create")
    public QuestionResponse createOneQuest(@RequestBody QuestionRequest entity) {
        //TODO: process POST request
        QuestionResponse response = questionService.createOneQuestion(entity);
        return response;
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<String> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        if (questionService.updateQuestion(id, question)) {
            return ResponseEntity.ok("Question updated successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        if (questionService.deleteQuestion(id)) {
            return ResponseEntity.ok("Question deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
