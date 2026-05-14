import { axiosInstance } from "@/services/axiosInstance";
import { logoutAuthSession, refreshAuthSession } from "@/services/authSessionService";
import { resolveApiError } from "@/lib/api/errors";
import {
    clearStoredAuthSession,
    isAccessTokenExpired,
    readStoredAuthSession,
    storeAuthSession,
    updateStoredAuthUser,
} from "@/lib/auth/session";
import type {
    AuthSession,
    AuthUser,
    LoginFormValues,
    RegisterFormValues,
} from "../types";

type RegisterPayload = {
    username: string;
    displayname: string;
    avatar: string;
    password: string;
    email: string;
};

let syncSessionPromise: Promise<AuthSession> | null = null;

export async function login(values: LoginFormValues) {
    try {
        const response = await axiosInstance.post<AuthSession>("/auth/login", values);
        storeAuthSession(response.data);
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
        const response = await axiosInstance.post<AuthSession>("/auth/signup", payload);
        storeAuthSession(response.data);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Không thể tạo tài khoản lúc này."));
    }
}

export async function logout() {
    return logoutAuthSession();
}

export async function getCurrentUser() {
    try {
        const response = await axiosInstance.get<AuthUser>("/auth/me");
        updateStoredAuthUser(response.data);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Không thể tải thông tin tài khoản."));
    }
}

export async function googleLogin(idToken: string) {
    try {
        const response = await axiosInstance.post<AuthSession>("/auth/google", { idToken });
        storeAuthSession(response.data);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Đăng nhập bằng Google không thành công."));
    }
}

export async function refreshSession(refreshToken: string) {
    return refreshAuthSession(refreshToken);
}

export async function syncAuthSession() {
    syncSessionPromise ??= (async () => {
        const storedSession = readStoredAuthSession();
        if (!storedSession?.accessToken || !storedSession.refreshToken) {
            clearStoredAuthSession();
            throw new Error("Phiên đăng nhập không còn hợp lệ.");
        }

        let nextSession = storedSession;

        if (isAccessTokenExpired(storedSession.accessToken)) {
            try {
                nextSession = await refreshSession(storedSession.refreshToken);
            } catch (error) {
                clearStoredAuthSession();
                throw error instanceof Error ? error : new Error("Phiên đăng nhập đã hết hạn.");
            }
        }

        const user = await getCurrentUser();
        const syncedSession: AuthSession = {
            ...nextSession,
            user,
        };
        storeAuthSession(syncedSession);
        return syncedSession;
    })().finally(() => {
        syncSessionPromise = null;
    });

    return syncSessionPromise;
}
