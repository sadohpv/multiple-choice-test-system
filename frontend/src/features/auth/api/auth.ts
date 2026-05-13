import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/constants/config";
import { axiosInstance } from "@/services/axiosInstance";
import type {
    AuthMessageResponse,
    AuthSession,
    AuthUser,
    LoginFormValues,
    RegisterFormValues,
} from "../types";
import {
    clearStoredAuthSession,
    isAccessTokenExpired,
    readStoredAuthSession,
    storeAuthSession,
    updateStoredAuthUser,
} from "../utils/session";
import { extractErrorMessage } from "../utils/validation";

type RegisterPayload = {
    username: string;
    displayname: string;
    avatar: string;
    password: string;
    email: string;
};

let syncSessionPromise: Promise<AuthSession> | null = null;

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
    const session = readStoredAuthSession();

    try {
        if (!session?.refreshToken) {
            return { message: "Đăng xuất thành công." } satisfies AuthMessageResponse;
        }

        const response = await axiosInstance.post<AuthMessageResponse>("/auth/logout", {
            refreshToken: session.refreshToken,
        });
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Đăng xuất không thành công."));
    } finally {
        clearStoredAuthSession();
    }
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
    try {
        const response = await axios.post<AuthSession>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        storeAuthSession(response.data);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Phiên đăng nhập đã hết hạn."));
    }
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
