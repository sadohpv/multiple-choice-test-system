package com.mezon.backend.controller;

import com.mezon.backend.dto.RoleUpsertRequest;
import com.mezon.backend.entity.Role;
import com.mezon.backend.exception.DuplicateFieldException;
import com.mezon.backend.repository.RoleRepository;
import com.mezon.backend.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mezon.backend.security.Auditable;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin("*")
public class RoleController {
    private static final String SYSTEM_ROLE_ADMIN = "ADMIN";

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private RoleService roleService;

    // GET: http://localhost:8080/api/roles
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // GET BY ID: http://localhost:8080/api/roles/1
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        return roleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/max-role-level/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public ResponseEntity<Integer> getMaxRoleLevelByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(roleService.getMaxRoleLevel(userId));
    }

    // POST: http://localhost:8080/api/roles
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "CREATE_ROLE")
    public ResponseEntity<Role> createRole(@Valid @RequestBody RoleUpsertRequest request) {
        Role role = toRole(request);
        ensureRoleNameNotDuplicatedForCreate(role.getRoleName());
        roleRepository.save(role);
        return ResponseEntity.created(URI.create("/api/roles")).body(role);
    }

    // PUT: http://localhost:8080/api/roles/1
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "UPDATE_ROLE")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @Valid @RequestBody RoleUpsertRequest request) {
        Role existingRole = roleRepository.findById(id).orElse(null);
        if (existingRole == null) {
            return ResponseEntity.notFound().build();
        }
        ensureRoleNotSystem(existingRole);

        Role role = toRole(request);
        ensureRoleNameNotDuplicatedForUpdate(role.getRoleName(), id);
        roleRepository.update(id, role);
        return roleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(role));
    }

    // DELETE: http://localhost:8080/api/roles/1
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "DELETE_ROLE")
    public ResponseEntity<String> deleteRole(@PathVariable Long id) {
        Role existingRole = roleRepository.findById(id).orElse(null);
        if (existingRole == null) {
            return ResponseEntity.notFound().build();
        }
        ensureRoleNotSystem(existingRole);

        roleRepository.deleteById(id);
        return ResponseEntity.ok("Role deleted successfully");
    }

    private Role toRole(RoleUpsertRequest request) {
        Role role = new Role();
        role.setRoleName(request.roleName().trim());
        role.setDescription(request.description() == null ? null : request.description().trim());
        role.setRoleLevel(request.roleLevel());
        return role;
    }

    private void ensureRoleNotSystem(Role role) {
        if (SYSTEM_ROLE_ADMIN.equalsIgnoreCase(role.getRoleName())) {
            throw new IllegalArgumentException("Không thể sửa hoặc xóa role hệ thống ADMIN");
        }
    }

    private void ensureRoleNameNotDuplicatedForCreate(String roleName) {
        if (roleRepository.existsByRoleNameIgnoreCase(roleName)) {
            throw new DuplicateFieldException("Tên role đã tồn tại");
        }
    }

    private void ensureRoleNameNotDuplicatedForUpdate(String roleName, Long id) {
        if (roleRepository.existsByRoleNameIgnoreCaseAndIdNot(roleName, id)) {
            throw new DuplicateFieldException("Tên role đã tồn tại");
        }
    }
}