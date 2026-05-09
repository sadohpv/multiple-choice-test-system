package com.mezon.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mezon.backend.entity.Subject;
import com.mezon.backend.security.UserIdToken;
import com.mezon.backend.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<Subject> getAllSubjects(@UserIdToken Long userId) {
        List<Subject> result = subjectService.getAllSubject();
        return result;
    }

    @PostMapping
    public Subject createSubject(
            @UserIdToken Long userId,
            @RequestBody Subject subject) {
        System.out.print("SUBJECT" + subject.toString());
        return subjectService.createSubject(userId, subject);
    }
}