package com.mezon.backend.controller;

import com.mezon.backend.entity.Role;
import com.mezon.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin("*")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    // GET: http://localhost:8080/api/roles
    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // GET BY ID: http://localhost:8080/api/roles/1
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        return roleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: http://localhost:8080/api/roles (Dùng để thêm mới)
    @PostMapping
    public ResponseEntity<String> createRole(@RequestBody Role role) {
        roleRepository.save(role);
        return ResponseEntity.ok("Role created successfully");
    }

    // PUT: http://localhost:8080/api/roles/1 (Dùng để sửa)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateRole(@PathVariable Long id, @RequestBody Role role) {
        if (roleRepository.update(id, role) > 0) {
            return ResponseEntity.ok("Role updated successfully");
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE: http://localhost:8080/api/roles/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRole(@PathVariable Long id) {
        if (roleRepository.deleteById(id) > 0) {
            return ResponseEntity.ok("Role deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}