package com.mezon.backend.service;

import java.util.List;
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
        System.out.println("User role level is: " + level);
    }

	public List<Subject> getAllUsers() {
		return subjectRepository.findAll();
	}
}
