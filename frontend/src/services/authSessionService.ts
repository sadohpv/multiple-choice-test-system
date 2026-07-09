import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import type { AuthMessageResponse, AuthSession } from "@/features/auth/types";
import { resolveApiError } from "@/lib/api/errors";
import { clearStoredAuthSession, readStoredAuthSession, storeAuthSession } from "@/lib/auth/session";

const authSessionClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const LOCAL_LOGOUT_RESPONSE: AuthMessageResponse = {
    message: "Đăng xuất thành công.",
};

let refreshSessionPromise: Promise<AuthSession> | null = null;

export async function refreshAuthSession(refreshToken: string) {
    try {
        const response = await authSessionClient.post<AuthSession>("/auth/refresh", { refreshToken });
        storeAuthSession(response.data);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiError(error, "Phiên đăng nhập đã hết hạn."));
    }
}

export async function refreshAuthSessionOnce(refreshToken: string) {
    refreshSessionPromise ??= refreshAuthSession(refreshToken).finally(() => {
        refreshSessionPromise = null;
    });

    return refreshSessionPromise;
}

export async function logoutAuthSession() {
    const session = readStoredAuthSession();
    clearStoredAuthSession();

    if (!session?.refreshToken) {
        return LOCAL_LOGOUT_RESPONSE;
    }

    try {
        const response = await authSessionClient.post<AuthMessageResponse>("/auth/logout", {
            refreshToken: session.refreshToken,
        });
        return response.data;
    } catch {
        return LOCAL_LOGOUT_RESPONSE;
    }
}
