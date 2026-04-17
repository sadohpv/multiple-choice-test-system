package com.mezon.backend.service;

import com.mezon.backend.dto.UserCreateRequest;
import com.mezon.backend.entity.User;
import com.mezon.backend.exception.DuplicateFieldException;
import com.mezon.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(UserCreateRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new DuplicateFieldException("Username '" + req.username() + "' already exists");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new DuplicateFieldException("Email '" + req.email() + "' already exists");
        }
        User user = new User(null, req.username(), req.displayname(),
                req.avatar(), req.password(), req.email(), null, null);
        return userRepository.save(user);
    }

    public boolean updateUser(Long id, UserCreateRequest req) {
        // fetch existing user
        Optional<User> existing = userRepository.findById(id);
        if (existing.isEmpty())
            return false;

        User current = existing.get();
        // check dup only if username changed
        if (!current.username().equals(req.username())
                && userRepository.existsByUsername(req.username())) {
            throw new DuplicateFieldException("Username '" + req.username() + "' already exists");
        }
        // check dup only if email changed
        if (!current.email().equals(req.email())
                && userRepository.existsByEmail(req.email())) {
            throw new DuplicateFieldException("Email '" + req.email() + "' already exists");
        }

        // map dto to entity
        User updatedUser = new User(id, req.username(), req.displayname(),
                req.avatar(), req.password(), req.email(), null, null);
        return userRepository.update(id, updatedUser) > 0;
    }

    public boolean deleteUser(Long id) {
        return userRepository.deleteById(id) > 0;
    }
}