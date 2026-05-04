import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { AuthSession } from "../types";

export const AUTH_SESSION_CHANGED_EVENT = "mezon-auth-session-changed";

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

export function clearStoredAuthSession() {
    localStorage.removeItem(STORAGE_KEYS.authSession);
    localStorage.removeItem(STORAGE_KEYS.authUser);
    notifyAuthSessionChanged();
}

export function notifyAuthSessionChanged() {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}
