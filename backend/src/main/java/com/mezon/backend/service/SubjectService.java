package com.mezon.backend.service;

import java.util.List;

import com.mezon.backend.entity.Subject;
import com.mezon.backend.repository.SubjectRepository;

public class SubjectService {

	private final SubjectRepository subjectRepository;

	public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

	public List<Subject> getAllUsers() {
		return subjectRepository.findAll();
	}
}
