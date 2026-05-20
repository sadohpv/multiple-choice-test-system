package com.mezon.backend.controller;

import com.mezon.backend.dto.AuthMessageResponse;
import com.mezon.backend.dto.AuthResponse;
import com.mezon.backend.dto.ChangePasswordRequest;
import com.mezon.backend.dto.GoogleLoginRequest;
import com.mezon.backend.dto.LoginRequest;
import com.mezon.backend.dto.LogoutRequest;
import com.mezon.backend.dto.RefreshTokenRequest;
import com.mezon.backend.dto.UpdateProfileRequest;
import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.security.UserIdToken;
import com.mezon.backend.service.AuthService;
import com.mezon.backend.service.GoogleAuthService;
import com.mezon.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final UserService userService;

    public AuthController(AuthService authService, GoogleAuthService googleAuthService, UserService userService) {
        this.authService = authService;
        this.googleAuthService = googleAuthService;
        this.userService = userService;
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
    public ResponseEntity<UserResponse> currentUser(@UserIdToken Long userId) {
        return ResponseEntity.ok(authService.currentUser(userId));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<AuthMessageResponse> updateProfile(
            @UserIdToken Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        userService.updateDisplayname(userId, request.displayname());
        return ResponseEntity.ok(new AuthMessageResponse("Cập nhật thành công"));
    }

    @PutMapping("/me/password")
    public ResponseEntity<AuthMessageResponse> changePassword(
            @UserIdToken Long userId,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request.currentPassword(), request.newPassword());
        return ResponseEntity.ok(new AuthMessageResponse("Đổi mật khẩu thành công"));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(googleAuthService.loginWithGoogle(request.idToken()));
    }
}
