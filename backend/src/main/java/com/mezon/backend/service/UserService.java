package com.mezon.backend.service;

import com.mezon.backend.entity.User;
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

    public User createUser(User user) {
        userRepository.save(user);
        return user;
    }

    public boolean updateUser(Long id, User user) {
        return userRepository.update(id, user) > 0;
    }

    public boolean deleteUser(Long id) {
        return userRepository.deleteById(id) > 0;
    }
}