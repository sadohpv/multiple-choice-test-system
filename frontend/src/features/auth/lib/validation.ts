import type { FieldErrors, LoginFormValues, RegisterFormValues } from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._-]{3,20}$/;

export function validateLogin(values: LoginFormValues) {
    const errors: FieldErrors<LoginFormValues> = {};

    if (!values.identity.trim()) {
        errors.identity = "Nhập email hoặc tên đăng nhập.";
    }

    if (!values.password) {
        errors.password = "Nhập mật khẩu để tiếp tục.";
    }

    return errors;
}

export function validateRegister(values: RegisterFormValues) {
    const errors: FieldErrors<RegisterFormValues> = {};

    if (!values.username.trim()) {
        errors.username = "Tên đăng nhập là bắt buộc.";
    } else if (!usernamePattern.test(values.username.trim())) {
        errors.username = "Dùng 3-20 ký tự gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.";
    }

    if (!values.displayName.trim()) {
        errors.displayName = "Nhập tên hiển thị.";
    } else if (values.displayName.trim().length < 2) {
        errors.displayName = "Tên hiển thị cần tối thiểu 2 ký tự.";
    }

    if (!values.email.trim()) {
        errors.email = "Email là bắt buộc.";
    } else if (!emailPattern.test(values.email.trim())) {
        errors.email = "Email chưa đúng định dạng.";
    }

    if (!values.password) {
        errors.password = "Nhập mật khẩu.";
    } else if (values.password.length < 8) {
        errors.password = "Mật khẩu cần tối thiểu 8 ký tự.";
    }

    return errors;
}
