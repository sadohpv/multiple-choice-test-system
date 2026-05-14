import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/config";
import type { AuthSession } from "@/features/auth/types";
import { clearStoredAuthSession, readStoredAuthSession } from "@/lib/auth/session";
import { refreshAuthSessionOnce } from "./authSessionService";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(config => {
    const session = readStoredAuthSession();
    if (session) {
        setAuthorizationHeader(config, session);
    }

    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        if (!originalRequest || !shouldRefresh(error, originalRequest)) {
            return Promise.reject(error);
        }

        const session = readStoredAuthSession();
        if (!session?.refreshToken) {
            clearStoredAuthSession();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const nextSession = await refreshAuthSessionOnce(session.refreshToken);
            setAuthorizationHeader(originalRequest, nextSession);
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            clearStoredAuthSession();
            return Promise.reject(refreshError);
        }
    },
);

function shouldRefresh(error: AxiosError, request: RetryableRequestConfig) {
    if (request._retry || error.response?.status !== 401) {
        return false;
    }

    const url = request.url ?? "";
    const authEndpointsToSkip = [
        "/auth/login",
        "/auth/signup",
        "/auth/refresh",
        "/auth/logout",
        "/auth/google", // Thêm Google login vào danh sách bỏ qua
        "/auth/forgot-password",
        "/auth/reset-password",
    ];

    return !authEndpointsToSkip.some(path =>
        url.includes(path),
    );
}

function setAuthorizationHeader(config: InternalAxiosRequestConfig, session: AuthSession) {
    config.headers.Authorization = `${session.tokenType} ${session.accessToken}`;
}
