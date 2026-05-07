import { useEffect, useRef, useState } from "react";
import { googleLogin } from "../api/auth";
import type { AuthSession } from "../types";

type GoogleLoginButtonProps = {
    onSuccess: (session: AuthSession) => void;
    onError?: (error: Error) => void;
};

declare const google: any;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    // Keep callback refs current so the single initialize() always uses latest handlers
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID || !containerRef.current) return;

        let cancelled = false;

        const initializeGoogle = () => {
            if (cancelled || !containerRef.current) return;

            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (response: { credential: string }) => {
                        setLoading(true);
                        try {
                            const session = await googleLogin(response.credential);
                            onSuccessRef.current(session);
                        } catch (err) {
                            onErrorRef.current?.(
                                err instanceof Error
                                    ? err
                                    : new Error("Đăng nhập Google thất bại."),
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                    use_fedcm_for_prompt: true,
                });

                google.accounts.id.renderButton(containerRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    width: containerRef.current.offsetWidth,
                    text: "signin_with",
                });
            } catch {
                // GSI script not loaded yet — handled by the polling below
            }
        };

        // If GSI script is already loaded, initialize immediately
        if (typeof google !== "undefined" && google.accounts) {
            initializeGoogle();
        } else {
            // Poll until the async GSI script finishes loading
            const interval = setInterval(() => {
                if (typeof google !== "undefined" && google.accounts) {
                    clearInterval(interval);
                    initializeGoogle();
                }
            }, 100);
            return () => {
                cancelled = true;
                clearInterval(interval);
            };
        }

        return () => {
            cancelled = true;
        };
    }, []);

    if (!GOOGLE_CLIENT_ID) {
        return null;
    }

    return (
        <div className="flex w-full justify-center">
            <div
                ref={containerRef}
                className={loading ? "pointer-events-none opacity-50" : ""}
            />
        </div>
    );
}
