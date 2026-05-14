import { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID, GOOGLE_LOGIN_ENABLED } from "@/constants/config";
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

type GoogleLoginListener = {
    onSuccess: (session: AuthSession) => void;
    onError?: (error: Error) => void;
    setLoading: (loading: boolean) => void;
};

type GoogleIdentityState = {
    activeListener: GoogleLoginListener | null;
    initialized: boolean;
    scriptPromise: Promise<void> | null;
};

declare global {
    interface Window {
        __mezonGoogleIdentityState?: GoogleIdentityState;
        google?: GoogleIdentityServices;
    }
}

const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function getGoogleIdentityState() {
    window.__mezonGoogleIdentityState ??= {
        activeListener: null,
        initialized: false,
        scriptPromise: null,
    };

    return window.__mezonGoogleIdentityState;
}

function loadGoogleIdentityScript() {
    if (window.google?.accounts.id) {
        return Promise.resolve();
    }

    const state = getGoogleIdentityState();
    if (state.scriptPromise) {
        return state.scriptPromise;
    }

    state.scriptPromise = new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(
            `script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`,
        );

        const script = existingScript ?? document.createElement("script");

        const handleLoad = () => resolve();
        const handleError = () => reject(new Error("Failed to load Google Identity Services."));

        script.addEventListener("load", handleLoad, { once: true });
        script.addEventListener("error", handleError, { once: true });

        if (!existingScript) {
            script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }).catch((error) => {
        state.scriptPromise = null;
        throw error;
    });

    return state.scriptPromise;
}

async function handleGoogleCredentialResponse(response: GoogleCredentialResponse) {
    const listener = getGoogleIdentityState().activeListener;
    if (!listener) {
        return;
    }

    listener.setLoading(true);
    try {
        const session = await googleLogin(response.credential);
        listener.onSuccess(session);
    } catch (error) {
        listener.onError?.(error instanceof Error ? error : new Error("Dang nhap Google that bai."));
    } finally {
        listener.setLoading(false);
    }
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
        onErrorRef.current = onError;
    }, [onSuccess, onError]);

    useEffect(() => {
        if (!GOOGLE_LOGIN_ENABLED || !containerRef.current) {
            return;
        }

        let cancelled = false;

        const listener: GoogleLoginListener = {
            onSuccess: (session) => {
                if (!cancelled) {
                    onSuccessRef.current(session);
                }
            },
            onError: (error) => {
                if (!cancelled) {
                    onErrorRef.current?.(error);
                }
            },
            setLoading: (nextLoading) => {
                if (!cancelled) {
                    setLoading(nextLoading);
                }
            },
        };

        const state = getGoogleIdentityState();
        state.activeListener = listener;

        void loadGoogleIdentityScript()
            .then(() => {
                if (cancelled || !containerRef.current || !window.google?.accounts.id) {
                    return;
                }

                if (!state.initialized) {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleCredentialResponse,
                        use_fedcm_for_prompt: true,
                    });
                    state.initialized = true;
                }

                containerRef.current.replaceChildren();
                window.google.accounts.id.renderButton(containerRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    width: containerRef.current.offsetWidth || 320,
                    text: "signin_with",
                });
            })
            .catch((error) => {
                listener.onError?.(error instanceof Error ? error : new Error("Khong the tai Google Sign-In."));
            });

        return () => {
            cancelled = true;
            if (state.activeListener === listener) {
                state.activeListener = null;
            }
        };
    }, []);

    if (!GOOGLE_LOGIN_ENABLED) {
        return null;
    }

    return (
        <div className="flex w-full justify-center">
            <div ref={containerRef} className={loading ? "pointer-events-none opacity-50" : ""} />
        </div>
    );
}
