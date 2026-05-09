package com.mezon.backend.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.mezon.backend.entity.Subject;
import com.mezon.backend.repository.SubjectRepository;

@Service
public class SubjectService {
	private final SubjectRepository subjectRepository;
	private final RoleService roleService;

	public SubjectService(SubjectRepository subjectRepository, RoleService roleService) {
		this.subjectRepository = subjectRepository;
		this.roleService = roleService;
	}

	public void checkPermissionBeforeAction(Long roleId) {
		int level = roleService.getMaxRoleLevel(roleId);
	}

	public List<Subject> getAllSubject() {
		return subjectRepository.findAll();
	}

	public Subject createSubject(Long userId, Subject subjectData) {
		if (!roleService.checkCanCreate(userId)) {
			throw new AccessDeniedException("Người dùng không có quyền tạo Subject.");
		}
		return subjectRepository.createSubject(subjectData);
	}

}
