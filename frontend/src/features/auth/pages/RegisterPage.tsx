import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { AuthField } from "../components/AuthField";
import { FormStatusAlert } from "../components/FormStatusAlert";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import type { FieldErrors, FormStatus, RegisterFormValues } from "../types";
import { validateRegister } from "../utils/validation";
import { useApi } from "@/lib/Context/useAPI";

const initialValues: RegisterFormValues = {
    username: "",
    displayName: "",
    email: "",
    password: "",
};

const idleStatus: FormStatus = {
    message: "",
    tone: "idle",
};

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useApi();
    const [values, setValues] = useState<RegisterFormValues>(initialValues);
    const [errors, setErrors] = useState<FieldErrors<RegisterFormValues>>({});
    const [status, setStatus] = useState<FormStatus>(idleStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = <K extends keyof RegisterFormValues>(field: K, nextValue: RegisterFormValues[K]) => {
        setValues(current => ({
            ...current,
            [field]: nextValue,
        }));

        if (errors[field]) {
            setErrors(current => ({
                ...current,
                [field]: undefined,
            }));
        }

        if (status.tone !== "idle") {
            setStatus(idleStatus);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payloadValues: RegisterFormValues = {
            username: values.username.trim(),
            displayName: values.displayName.trim(),
            email: values.email.trim(),
            password: values.password,
        };

        const nextErrors = validateRegister(payloadValues);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setStatus(idleStatus);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setStatus(idleStatus);

        try {
            await register(payloadValues);
            navigate(APP_PATHS.profile, { replace: true });
        } catch (error) {
            setStatus({
                message: error instanceof Error ? error.message : "Đã có lỗi xảy ra khi tạo tài khoản.",
                tone: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-neutral-900">Tạo tài khoản</h2>
                <p className="mt-0.5 text-sm text-neutral-400">Bắt đầu hành trình luyện thi của bạn.</p>
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
                <AuthField
                    autoComplete="username"
                    error={errors.username}
                    label="Tên đăng nhập"
                    name="username"
                    onChange={event => handleChange("username", event.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    value={values.username}
                />

                <AuthField
                    autoComplete="name"
                    error={errors.displayName}
                    label="Tên hiển thị"
                    name="displayName"
                    onChange={event => handleChange("displayName", event.target.value)}
                    placeholder="Nhập tên hiển thị"
                    value={values.displayName}
                />

                <AuthField
                    autoComplete="email"
                    error={errors.email}
                    label="Email"
                    name="email"
                    onChange={event => handleChange("email", event.target.value)}
                    placeholder="Nhập email"
                    type="email"
                    value={values.email}
                />

                <AuthField
                    autoComplete="new-password"
                    error={errors.password}
                    label="Mật khẩu"
                    name="password"
                    onChange={event => handleChange("password", event.target.value)}
                    placeholder="••••••••"
                    type="password"
                    value={values.password}
                />

                <FormStatusAlert status={status} />

                <div className="space-y-2.5 pt-1">
                    <Button className="w-full" disabled={isSubmitting} size="lg" type="submit" variant="accent">
                        {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                    </Button>

                    <div className="relative flex items-center">
                        <div className="grow border-t border-neutral-200" />
                        <span className="shrink-0 px-3 text-xs text-neutral-400">hoặc</span>
                        <div className="grow border-t border-neutral-200" />
                    </div>

                    <GoogleLoginButton
                        onSuccess={() => navigate(APP_PATHS.profile, { replace: true })}
                        onError={err => setStatus({ message: err.message, tone: "error" })}
                    />

                    <Button asChild className="w-full" variant="ghost">
                        <Link to={AUTH_PATHS.login}>Đã có tài khoản? Đăng nhập</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
