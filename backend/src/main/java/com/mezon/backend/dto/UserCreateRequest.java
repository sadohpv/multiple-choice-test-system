package com.mezon.backend.dto;

public record UserCreateRequest(
        String username,
        String displayname,
        String avatar,
        String password,
        String email) {
}