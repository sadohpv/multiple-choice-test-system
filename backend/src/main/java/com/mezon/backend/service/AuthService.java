package com.mezon.backend.service;

import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.mezon.backend.dto.AuthResponse;
import com.mezon.backend.dto.LoginRequest;
import com.mezon.backend.dto.LogoutRequest;
import com.mezon.backend.dto.RefreshTokenRequest;
import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.entity.Role;
import com.mezon.backend.entity.User;
import com.mezon.backend.exception.InvalidRefreshTokenException;
import com.mezon.backend.repository.RoleRepository;

@Service
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RoleRepository roleRepository;

    public AuthService(UserService userService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            RoleRepository roleRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.roleRepository = roleRepository;
    }

    public AuthResponse signup(UserCreateRequest request) {
        User user = userService.createUser(request);
        return issueTokens(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userService.authenticate(request.identity(), request.password())
                .orElseThrow(() -> new BadCredentialsException("Thông tin đăng nhập không chính xác"));
        return issueTokens(user);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshTokenService.RefreshTokenRotation rotation = refreshTokenService.rotate(request.refreshToken());
        User user = userService.getUserById(rotation.userId())
                .orElseThrow(() -> new InvalidRefreshTokenException("Người dùng không còn tồn tại"));

        String accessToken = jwtService.createAccessToken(user, getRoleNames(user.id()));
        return AuthResponse.bearer(
                accessToken,
                jwtService.accessTokenExpiresInSeconds(),
                rotation.refreshToken(),
                UserResponse.from(user));
    }

    public void logout(LogoutRequest request) {
        refreshTokenService.revoke(request.refreshToken());
    }

    public UserResponse currentUser(Long userId) {
        return userService.getUserById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new BadCredentialsException("Phiên đăng nhập không còn hợp lệ"));
    }

    private AuthResponse issueTokens(User user) {
        List<String> roles = getRoleNames(user.id());
<<<<<<< HEAD
        String accessToken = jwtService.createAccessToken(user, roles);
=======
        String accessToken = jwtService.createAccessToken(user);
>>>>>>> origin/develop
        String refreshToken = refreshTokenService.createRefreshToken(user.id());
        return AuthResponse.bearer(
                accessToken,
                jwtService.accessTokenExpiresInSeconds(),
                refreshToken,
                UserResponse.from(user));
    }

    private List<String> getRoleNames(Long userId) {
        return roleRepository.findRolesByUserId(userId)
                .stream()
                .map(Role::getRoleName)
                .toList();
    }
}
