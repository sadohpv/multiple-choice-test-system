import type { AuthSession, AuthUser } from "@/features/auth/types";
import { AUTH_SESSION_CHANGED_EVENT, readStoredAuthSession } from "@/features/auth/utils/session";
import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type AuthContextValue = {
    session: AuthSession | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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

    const value = useMemo<AuthContextValue>(
        () => ({
            session,
            user: session?.user ?? null,
            isAuthenticated: Boolean(session?.accessToken),
        }),
        [session],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthContext;
