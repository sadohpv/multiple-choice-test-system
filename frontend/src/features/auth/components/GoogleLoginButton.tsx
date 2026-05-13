import { useEffect, useRef, useState } from "react";
import { googleLogin } from "../api/auth";
import type { AuthSession } from "../types";

type GoogleLoginButtonProps = {
    onSuccess: (session: AuthSession) => void;
    onError?: (error: Error) => void;
};

type GoogleCredentialResponse = {
    credential: string;
};

type GoogleIdInitializeOptions = {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void | Promise<void>;
    use_fedcm_for_prompt?: boolean;
};

type GoogleRenderButtonOptions = {
    type: "standard";
    theme: "outline";
    size: "large";
    width: number;
    text: "signin_with";
};

type GoogleIdentityServices = {
    accounts: {
        id: {
            initialize: (options: GoogleIdInitializeOptions) => void;
            renderButton: (element: HTMLElement, options: GoogleRenderButtonOptions) => void;
        };
    };
};

declare global {
    interface Window {
        google?: GoogleIdentityServices;
    }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID || !containerRef.current) return;

        let cancelled = false;

        const initializeGoogle = () => {
            if (cancelled || !containerRef.current) return;

            const googleIdentity = window.google;
            if (!googleIdentity) return;

            try {
                googleIdentity.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (response: GoogleCredentialResponse) => {
                        setLoading(true);
                        try {
                            const session = await googleLogin(response.credential);
                            onSuccessRef.current(session);
                        } catch (err) {
                            onErrorRef.current?.(
                                err instanceof Error ? err : new Error("Đăng nhập Google thất bại."),
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                    use_fedcm_for_prompt: true,
                });

                googleIdentity.accounts.id.renderButton(containerRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    width: containerRef.current.offsetWidth,
                    text: "signin_with",
                });
            } catch {
                // GSI script not loaded yet; polling below will retry.
            }
        };

        if (window.google?.accounts.id) {
            initializeGoogle();
        } else {
            const interval = window.setInterval(() => {
                if (window.google?.accounts.id) {
                    window.clearInterval(interval);
                    initializeGoogle();
                }
            }, 100);

            return () => {
                cancelled = true;
                window.clearInterval(interval);
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
            <div ref={containerRef} className={loading ? "pointer-events-none opacity-50" : ""} />
        </div>
    );
}
