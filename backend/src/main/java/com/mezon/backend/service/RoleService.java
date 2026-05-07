package com.mezon.backend.service;

import com.mezon.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public int getMaxRoleLevel(Long userId) {
        return roleRepository.getMaxRoleLevelByUserId(userId);
    }

}
