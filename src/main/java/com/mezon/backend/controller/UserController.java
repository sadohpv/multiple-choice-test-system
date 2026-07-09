package com.mezon.backend.controller;

import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.entity.Role;
import com.mezon.backend.service.RoleService;
import com.mezon.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mezon.backend.security.Auditable;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(UserResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(UserResponse::from)
                .map(ResponseEntity::ok) // return 200 ok if found
                .orElse(ResponseEntity.notFound().build()); // return 404 if null
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "CREATE_USER")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest req) {
        // save to db then convert to dto
        UserResponse created = UserResponse.from(userService.createUser(req));
        // return 201 status & set location header
        return ResponseEntity.created(URI.create("/api/users/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "UPDATE_USER")
    public ResponseEntity<String> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserCreateRequest req) {
        if (userService.updateUser(id, req)) {
            return ResponseEntity.ok("User updated successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "DELETE_USER")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public ResponseEntity<List<Role>> getUserRoles(@PathVariable Long id) {
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(roleService.getRolesByUserId(id));
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Auditable(action = "ASSIGN_USER_ROLES")
    public ResponseEntity<String> assignRolesToUser(@PathVariable Long id, @RequestBody List<Long> roleIds) {
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        roleService.assignRolesToUser(id, roleIds);
        return ResponseEntity.ok("User roles updated successfully");
    }
}
