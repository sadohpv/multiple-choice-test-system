package com.mezon.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
        @NotBlank(message = "Tên đăng nhập là bắt buộc")
        @Pattern(regexp = "^[a-zA-Z0-9._-]{3,20}$", message = "Tên đăng nhập phải gồm 3-20 ký tự chữ, số, dấu chấm, gạch ngang hoặc gạch dưới")
        String username,
        @NotBlank(message = "Tên hiển thị là bắt buộc")
        @Size(min = 2, max = 100, message = "Tên hiển thị phải từ 2-100 ký tự")
        String displayname,
        String avatar,
        @NotBlank(message = "Mật khẩu là bắt buộc")
        @Size(min = 8, max = 100, message = "Mật khẩu phải từ 8-100 ký tự")
        String password,
        @NotBlank(message = "Email là bắt buộc")
        @Email(message = "Email chưa đúng định dạng")
        @Size(max = 200, message = "Email tối đa 200 ký tự")
        String email) {
}
