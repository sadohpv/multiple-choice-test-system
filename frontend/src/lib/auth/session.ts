import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { AuthSession, AuthUser } from "@/features/auth/types";

export const AUTH_SESSION_CHANGED_EVENT = "mezon-auth-session-changed";

const ACCESS_TOKEN_EXPIRY_BUFFER_MS = 5_000;

export function readStoredAuthSession(): AuthSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.authSession);
    if (!raw) {
        return null;
    }

    try {
        const session = JSON.parse(raw) as Partial<AuthSession>;
        if (
            typeof session.accessToken === "string" &&
            typeof session.refreshToken === "string" &&
            session.user &&
            typeof session.user.id === "number"
        ) {
            return session as AuthSession;
        }
    } catch {
        clearStoredAuthSession();
    }

    return null;
}

export function storeAuthSession(session: AuthSession) {
    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(session.user));
    notifyAuthSessionChanged();
}

export function updateStoredAuthUser(user: AuthUser) {
    const currentSession = readStoredAuthSession();
    if (!currentSession) {
        return;
    }

    storeAuthSession({
        ...currentSession,
        user,
    });
}

export function clearStoredAuthSession() {
    localStorage.removeItem(STORAGE_KEYS.authSession);
    localStorage.removeItem(STORAGE_KEYS.authUser);
    notifyAuthSessionChanged();
}

export function notifyAuthSessionChanged() {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function getAccessTokenExpiry(accessToken: string) {
    const payload = decodeJwtPayload(accessToken);
    if (!payload || typeof payload.exp !== "number") {
        return null;
    }

    return payload.exp * 1000;
}

export function isAccessTokenExpired(accessToken: string, now = Date.now()) {
    const expiresAt = getAccessTokenExpiry(accessToken);
    if (!expiresAt) {
        return true;
    }

    return expiresAt <= now + ACCESS_TOKEN_EXPIRY_BUFFER_MS;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    try {
        const normalizedPayload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
        const decoded = window.atob(paddedPayload);
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
}
