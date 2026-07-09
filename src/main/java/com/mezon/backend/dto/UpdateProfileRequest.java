package com.mezon.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Tên hiển thị là bắt buộc")
        @Size(min = 2, max = 100, message = "Tên hiển thị phải từ 2-100 ký tự")
        String displayname) {
}
