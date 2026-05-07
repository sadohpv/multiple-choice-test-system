package com.mezon.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record RoleUpsertRequest(
        @NotBlank(message = "Tên role là bắt buộc")
        @Size(max = 50, message = "Tên role tối đa 50 ký tự")
        String roleName,
        @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
        String description,
        @NotNull(message = "Role level là bắt buộc")
        @Positive(message = "Role level phải lớn hơn 0")
        Integer roleLevel) {
}
