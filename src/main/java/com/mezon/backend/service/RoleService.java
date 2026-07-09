package com.mezon.backend.service;

import com.mezon.backend.entity.Role;
import com.mezon.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    private static final int DEFAULT_CREATE_REQUIRED_LEVEL = 50;
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public int getMaxRoleLevel(Long userId) {
        return roleRepository.getMaxRoleLevelByUserId(userId);
    }

    public List<Role> getRolesByUserId(Long userId) {
        return roleRepository.findRolesByUserId(userId);
    }

    public void assignRolesToUser(Long userId, List<Long> roleIds) {
        roleRepository.assignRolesToUser(userId, roleIds);
    }

    public boolean checkCanCreate(Long userId) {
        return checkCanCreate(userId, DEFAULT_CREATE_REQUIRED_LEVEL);
    }

    public boolean checkCanCreate(Long userId, int requiredRoleLevel) {
        return getMaxRoleLevel(userId) >= requiredRoleLevel;
    }

    public void ensureCanCreate(Long userId, String resourceName) {
        ensureCanCreate(userId, DEFAULT_CREATE_REQUIRED_LEVEL, resourceName);
    }

    public void ensureCanCreate(Long userId, int requiredRoleLevel, String resourceName) {
        if (!checkCanCreate(userId, requiredRoleLevel)) {
            throw new IllegalArgumentException(
                    "Bạn không có quyền tạo " + resourceName + ". Yêu cầu role level >= " + requiredRoleLevel);
        }
    }

}
