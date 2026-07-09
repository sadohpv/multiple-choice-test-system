package com.mezon.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email hoặc tên đăng nhập là bắt buộc")
        String identity,
        @NotBlank(message = "Mật khẩu là bắt buộc")
        String password) {
}
