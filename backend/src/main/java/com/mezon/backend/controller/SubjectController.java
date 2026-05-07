package com.mezon.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mezon.backend.entity.Subject;
import com.mezon.backend.security.AuthenticatedUserPrincipal;
import com.mezon.backend.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<Subject> getAllSubjects(@AuthenticationPrincipal AuthenticatedUserPrincipal authentication) {
        List<Subject> result = subjectService.getAllSubject();
        System.out.println(authentication.id());
        return result;
    }

    @PostMapping
    public Subject createSubject(
            @AuthenticationPrincipal(expression = "userId") Long userId,

            @RequestBody Subject subject) {

        return subjectService.createSubject(userId, subject);
    }
}