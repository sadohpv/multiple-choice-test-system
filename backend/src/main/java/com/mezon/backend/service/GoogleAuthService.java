package com.mezon.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.mezon.backend.config.GoogleProperties;
import com.mezon.backend.dto.AuthResponse;
import com.mezon.backend.dto.UserResponse;
import com.mezon.backend.entity.Role;
import com.mezon.backend.entity.User;
import com.mezon.backend.repository.RoleRepository;
import com.mezon.backend.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final GoogleIdTokenVerifier verifier;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    public GoogleAuthService(
            GoogleProperties googleProperties,
            UserRepository userRepository,
            RoleRepository roleRepository,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.passwordEncoder = passwordEncoder;

        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleProperties.clientId()))
                .build();
    }

    public AuthResponse loginWithGoogle(String idToken) {
        GoogleIdToken.Payload payload = verifyIdToken(idToken);

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        User user = userRepository.findByUsernameOrEmail(email)
                .orElseGet(() -> createGoogleUser(email, name, picture));

        List<String> roles = roleRepository.findRolesByUserId(user.id())
                .stream()
                .map(Role::getRoleName)
                .toList();

        String accessToken = jwtService.createAccessToken(user, roles);
        String refreshToken = refreshTokenService.createRefreshToken(user.id());

        return AuthResponse.bearer(
                accessToken,
                jwtService.accessTokenExpiresInSeconds(),
                refreshToken,
                UserResponse.from(user, roles));
    }

    private GoogleIdToken.Payload verifyIdToken(String rawToken) {
        try {
            GoogleIdToken googleIdToken = verifier.verify(rawToken);
            if (googleIdToken == null) {
                throw new BadCredentialsException("Google ID Token không hợp lệ hoặc đã hết hạn");
            }
            return googleIdToken.getPayload();
        } catch (BadCredentialsException e) {
            throw e;
        } catch (Exception e) {
            throw new BadCredentialsException("Không thể xác thực Google ID Token: " + e.getMessage());
        }
    }

    private User createGoogleUser(String email, String name, String picture) {
        String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "");
        String username = generateUniqueUsername(baseUsername);
        String randomPassword = passwordEncoder.encode(UUID.randomUUID().toString());

        User newUser = new User(null, username, name != null ? name : username,
                picture, randomPassword, email, null, null);
        return userRepository.save(newUser);
    }

    private String generateUniqueUsername(String base) {
        String candidate = base.length() >= 3 ? base : base + "user";
        if (candidate.length() > 20) {
            candidate = candidate.substring(0, 20);
        }
        if (userRepository.existsByUsername(candidate)) {
            String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 5);
            candidate = candidate.substring(0, Math.min(candidate.length(), 15)) + suffix;
        }
        return candidate;
    }
}
