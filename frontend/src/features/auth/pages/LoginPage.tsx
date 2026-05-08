import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { AuthField } from "../components/AuthField";
import { FormStatusAlert } from "../components/FormStatusAlert";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import type { FormStatus, LoginFormValues } from "../types";
import { validateLogin } from "../utils/validation";
import { useApi } from "@/lib/Context/useAPI";

const initialValues: LoginFormValues = {
    identity: "",
    password: "",
};

const idleStatus: FormStatus = {
    message: "",
    tone: "idle",
};

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useApi();
    const [values, setValues] = useState<LoginFormValues>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
    const [status, setStatus] = useState<FormStatus>(idleStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: LoginFormValues = {
            identity: values.identity.trim(),
            password: values.password,
        };

        const nextErrors = validateLogin(payload);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setStatus(idleStatus);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setStatus(idleStatus);

        try {
            await login(payload);
            navigate(resolveRedirectPath(location.state), { replace: true });
        } catch (error) {
            setStatus({
                message: error instanceof Error ? error.message : "Đăng nhập không thành công.",
                tone: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-neutral-900">Chào mừng trở lại</h2>
                <p className="mt-0.5 text-sm text-neutral-400">Nhập thông tin để tiếp tục.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <AuthField
                    autoComplete="username"
                    error={errors.identity}
                    label="Email hoặc tên đăng nhập"
                    name="identity"
                    onChange={event =>
                        setValues(current => ({
                            ...current,
                            identity: event.target.value,
                        }))
                    }
                    placeholder="Nhập email hoặc tên đăng nhập"
                    value={values.identity}
                />

                <AuthField
                    autoComplete="current-password"
                    error={errors.password}
                    label="Mật khẩu"
                    name="password"
                    onChange={event =>
                        setValues(current => ({
                            ...current,
                            password: event.target.value,
                        }))
                    }
                    placeholder="••••••••"
                    type="password"
                    value={values.password}
                />

                <div className="flex justify-end">
                    <Link
                        to={AUTH_PATHS.forgotPassword}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <FormStatusAlert status={status} />

                <div className="space-y-2.5">
                    <Button className="w-full" disabled={isSubmitting} size="lg" type="submit" variant="accent">
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>

                    <div className="relative flex items-center">
                        <div className="grow border-t border-neutral-200" />
                        <span className="shrink-0 px-3 text-xs text-neutral-400">hoặc</span>
                        <div className="grow border-t border-neutral-200" />
                    </div>

                    <GoogleLoginButton
                        onSuccess={() => navigate(resolveRedirectPath(location.state), { replace: true })}
                        onError={err => setStatus({ message: err.message, tone: "error" })}
                    />

                    <Button asChild className="w-full" variant="ghost">
                        <Link to={AUTH_PATHS.register}>Chưa có tài khoản? Đăng ký</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}

function resolveRedirectPath(state: unknown) {
    if (
        state &&
        typeof state === "object" &&
        "from" in state &&
        state.from &&
        typeof state.from === "object" &&
        "pathname" in state.from &&
        typeof state.from.pathname === "string"
    ) {
        return state.from.pathname;
    }

    return APP_PATHS.home;
}
