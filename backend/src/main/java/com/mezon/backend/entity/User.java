package com.mezon.backend.entity;

public record User(
        Long id,
        String username,
        String avatar,
        String password,
        String email,
        Long createdAt,
        Long updatedAt) {
}