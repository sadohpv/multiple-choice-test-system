import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
} from "../api/auth";
import type { AuthSession, AuthUser, LoginFormValues, RegisterFormValues } from "../types";
import {
    AUTH_SESSION_CHANGED_EVENT,
    readStoredAuthSession,
    storeAuthSession,
} from "../utils/session";

type AuthContextValue = {
    session: AuthSession | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (values: LoginFormValues) => Promise<AuthSession>;
    register: (values: RegisterFormValues) => Promise<AuthSession>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<AuthUser>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<AuthSession | null>(() => readStoredAuthSession());

    useEffect(() => {
        const syncSession = () => {
            setSession(readStoredAuthSession());
        };

        window.addEventListener("storage", syncSession);
        window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);

        return () => {
            window.removeEventListener("storage", syncSession);
            window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
        };
    }, []);

    const login = useCallback(async (values: LoginFormValues) => {
        const nextSession = await loginRequest(values);
        setSession(nextSession);
        return nextSession;
    }, []);

    const register = useCallback(async (values: RegisterFormValues) => {
        const nextSession = await registerRequest(values);
        setSession(nextSession);
        return nextSession;
    }, []);

    const logout = useCallback(async () => {
        await logoutRequest();
        setSession(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const user = await getCurrentUser();
        const current = readStoredAuthSession();
        if (current) {
            const nextSession = { ...current, user };
            storeAuthSession(nextSession);
            setSession(nextSession);
        }
        return user;
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            session,
            user: session?.user ?? null,
            isAuthenticated: Boolean(session?.accessToken),
            login,
            register,
            logout,
            refreshUser,
        }),
        [login, logout, refreshUser, register, session],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
