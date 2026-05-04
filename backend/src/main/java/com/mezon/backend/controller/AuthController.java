package com.mezon.backend.controller;

import com.mezon.backend.dto.AuthMessageResponse;
import com.mezon.backend.dto.AuthResponse;
import com.mezon.backend.dto.LoginRequest;
import com.mezon.backend.dto.LogoutRequest;
import com.mezon.backend.dto.RefreshTokenRequest;
import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.security.AuthenticatedUserPrincipal;
import com.mezon.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody UserCreateRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthMessageResponse> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(new AuthMessageResponse("Đăng xuất thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> currentUser(@AuthenticationPrincipal AuthenticatedUserPrincipal principal) {
        return ResponseEntity.ok(authService.currentUser(principal.id()));
    }
}
