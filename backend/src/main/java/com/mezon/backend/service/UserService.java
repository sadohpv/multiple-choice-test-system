package com.mezon.backend.service;

import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.entity.User;
import com.mezon.backend.exception.DuplicateFieldException;
import com.mezon.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> authenticate(String identity, String rawPassword) {
        if (identity == null || identity.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            return Optional.empty();
        }

        Optional<User> user = userRepository.findByUsernameOrEmail(identity.trim());
        if (user.isEmpty()) {
            return Optional.empty();
        }

        String storedPassword = user.get().password();
        if (isBcryptHash(storedPassword) && passwordEncoder.matches(rawPassword, storedPassword)) {
            return user;
        }

        if (!isBcryptHash(storedPassword) && rawPassword.equals(storedPassword)) {
            userRepository.updatePassword(user.get().id(), passwordEncoder.encode(rawPassword));
            return user;
        }

        return Optional.empty();
    }

    public User createUser(UserCreateRequest req) {
        UserCreateRequest normalized = normalize(req);
        validateUserInput(normalized);

        if (userRepository.existsByUsername(normalized.username())) {
            throw new DuplicateFieldException("Tên đăng nhập '" + normalized.username() + "' đã tồn tại");
        }
        if (userRepository.existsByEmail(normalized.email())) {
            throw new DuplicateFieldException("Email '" + normalized.email() + "' đã tồn tại");
        }

        User user = new User(null, normalized.username(), normalized.displayname(),
                normalized.avatar(), passwordEncoder.encode(normalized.password()), normalized.email(), null, null);
        return userRepository.save(user);
    }

    public boolean updateUser(Long id, UserCreateRequest req) {
        UserCreateRequest normalized = normalize(req);
        validateUserInput(normalized);

        // fetch existing user
        Optional<User> existing = userRepository.findById(id);
        if (existing.isEmpty())
            return false;

        User current = existing.get();
        // check dup only if username changed
        if (!current.username().equals(normalized.username())
                && userRepository.existsByUsername(normalized.username())) {
            throw new DuplicateFieldException("Tên đăng nhập '" + normalized.username() + "' đã tồn tại");
        }
        // check dup only if email changed
        if (!current.email().equalsIgnoreCase(normalized.email())
                && userRepository.existsByEmail(normalized.email())) {
            throw new DuplicateFieldException("Email '" + normalized.email() + "' đã tồn tại");
        }

        // map dto to entity
        User updatedUser = new User(id, normalized.username(), normalized.displayname(),
                normalized.avatar(), passwordEncoder.encode(normalized.password()), normalized.email(), null, null);
        return userRepository.update(id, updatedUser) > 0;
    }

    public boolean deleteUser(Long id) {
        return userRepository.deleteById(id) > 0;
    }

    private UserCreateRequest normalize(UserCreateRequest req) {
        return new UserCreateRequest(
                req.username() == null ? null : req.username().trim(),
                req.displayname() == null ? null : req.displayname().trim(),
                req.avatar() == null ? null : req.avatar().trim(),
                req.password(),
                req.email() == null ? null : req.email().trim().toLowerCase());
    }

    private void validateUserInput(UserCreateRequest req) {
        if (req.username() == null || req.username().isBlank()) {
            throw new IllegalArgumentException("Tên đăng nhập là bắt buộc");
        }
        if (!req.username().matches("^[a-zA-Z0-9._-]{3,20}$")) {
            throw new IllegalArgumentException("Tên đăng nhập phải gồm 3-20 ký tự chữ, số, dấu chấm, gạch ngang hoặc gạch dưới");
        }
        if (req.displayname() == null || req.displayname().isBlank()) {
            throw new IllegalArgumentException("Tên hiển thị là bắt buộc");
        }
        if (req.displayname().length() < 2 || req.displayname().length() > 100) {
            throw new IllegalArgumentException("Tên hiển thị phải từ 2-100 ký tự");
        }
        if (req.email() == null || req.email().isBlank()) {
            throw new IllegalArgumentException("Email là bắt buộc");
        }
        if (!req.email().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Email chưa đúng định dạng");
        }
        if (req.password() == null || req.password().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu là bắt buộc");
        }
        if (req.password().length() < 8 || req.password().length() > 100) {
            throw new IllegalArgumentException("Mật khẩu phải từ 8-100 ký tự");
        }
    }

    private boolean isBcryptHash(String password) {
        return password != null
                && (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }
}
