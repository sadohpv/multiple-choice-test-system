package com.mezon.backend.service;

import com.mezon.backend.dto.AuthResponse;
import com.mezon.backend.dto.LoginRequest;
import com.mezon.backend.dto.LogoutRequest;
import com.mezon.backend.dto.RefreshTokenRequest;
import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.entity.User;
import com.mezon.backend.exception.InvalidRefreshTokenException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

// Service xử lý các nghiệp vụ xác thực (Đăng ký, đăng nhập, quản lý token)
@Service
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    // Inject các dependency cần thiết qua constructor
    public AuthService(UserService userService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    // Đăng ký tài khoản mới và trả về cặp token ngay lập tức
    public AuthResponse signup(UserCreateRequest request) {
        User user = userService.createUser(request);
        return issueTokens(user);
    }

    // Đăng nhập: Xác thực thông tin, nếu đúng thì cấp token, sai thì báo lỗi
    public AuthResponse login(LoginRequest request) {
        User user = userService.authenticate(request.identity(), request.password())
                .orElseThrow(() -> new BadCredentialsException("Thông tin đăng nhập không chính xác"));
        return issueTokens(user);
    }

    // Làm mới token: Xoay vòng Refresh Token cũ, tạo Access Token mới
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshTokenService.RefreshTokenRotation rotation = refreshTokenService.rotate(request.refreshToken());
        User user = userService.getUserById(rotation.userId())
                .orElseThrow(() -> new InvalidRefreshTokenException("Người dùng không còn tồn tại"));

        String accessToken = jwtService.createAccessToken(user);
        return AuthResponse.bearer(
                accessToken,
                jwtService.accessTokenExpiresInSeconds(),
                rotation.refreshToken(),
                UserResponse.from(user));
    }

    // vô hiệu hóa thu hồi Refresh Token
    public void logout(LogoutRequest request) {
        refreshTokenService.revoke(request.refreshToken());
    }

    // ấy thông tin user đang đăng nhập hiện tại dựa trên ID
    public UserResponse currentUser(Long userId) {
        return userService.getUserById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new BadCredentialsException("Phiên đăng nhập không còn hợp lệ"));
    }

    // helper func Sinh ra Access Token và Refresh Token cho user
    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.createAccessToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user.id());
        return AuthResponse.bearer(
                accessToken,
                jwtService.accessTokenExpiresInSeconds(),
                refreshToken,
                UserResponse.from(user));
    }
}