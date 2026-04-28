package com.mezon.backend.dto;

public record LoginRequest(
        String identity,
        String password) {
}
