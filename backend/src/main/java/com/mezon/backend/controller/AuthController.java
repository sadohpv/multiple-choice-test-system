package com.mezon.backend.controller;

import com.mezon.backend.dto.AuthMessageResponse;
import com.mezon.backend.dto.LoginRequest;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.identity() == null || request.identity().isBlank()
                || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(new AuthMessageResponse("Tên đăng nhập hoặc email và mật khẩu là bắt buộc"));
        }

        return userService.login(request.identity().trim(), request.password())
                .map(UserResponse::from)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthMessageResponse("Thông tin đăng nhập không chính xác")));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthMessageResponse> logout() {
        return ResponseEntity.ok(new AuthMessageResponse("Đăng xuất thành công"));
    }
}
