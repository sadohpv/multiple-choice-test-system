import { AxiosError } from "axios";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { axiosInstance } from "@/services/axiosInstance";
import type {
    AuthMessageResponse,
    AuthUser,
    LoginFormValues,
    RegisterFormValues,
} from "../types";
import { extractErrorMessage } from "../utils/validation";

type RegisterPayload = {
    username: string;
    displayname: string;
    avatar: string;
    password: string;
    email: string;
};

function resolveApiError(error: unknown, fallback: string) {
    if (error instanceof AxiosError) {
        return extractErrorMessage(error.response?.data, fallback);
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

export async function login(values: LoginFormValues) {
    try {
        const response = await axiosInstance.post<AuthUser>("/api/auth/login", values);
        localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Đăng nhập không thành công."));
    }
}

export async function register(values: RegisterFormValues) {
    const payload: RegisterPayload = {
        username: values.username.trim(),
        displayname: values.displayName.trim(),
        avatar: "",
        password: values.password,
        email: values.email.trim(),
    };

    try {
        const response = await axiosInstance.post<AuthUser>("/api/users", payload);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Không thể tạo tài khoản lúc này."));
    }
}

export async function logout() {
    try {
        const response = await axiosInstance.post<AuthMessageResponse>("/api/auth/logout");
        localStorage.removeItem(STORAGE_KEYS.authUser);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Đăng xuất không thành công."));
    }
}
