import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AUTH_PATHS } from "@/constants/path";
import { AuthField } from "../components/AuthField";
import { FormStatusAlert } from "../components/FormStatusAlert";
import type { FormStatus } from "../types";
import { axiosInstance } from "@/services/axiosInstance";

const idleStatus: FormStatus = { message: "", tone: "idle" };

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<FormStatus>(idleStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState<"email" | "reset">("email");

    const handleRequestReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) {
            setStatus({ message: "Vui lòng nhập email.", tone: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatus(idleStatus);

        try {
            const res = await axiosInstance.post<{ message: string; resetToken?: string }>(
                "/auth/forgot-password",
                { email: trimmed },
            );
            // In development the token is returned in response for testing
            if (res.data.resetToken) {
                setResetToken(res.data.resetToken);
            }
            setStep("reset");
            setStatus({
                message: "Mã đặt lại đã được tạo. Nhập mã và mật khẩu mới bên dưới.",
                tone: "success",
            });
        } catch (err) {
            setStatus({
                message:
                    err instanceof Error
                        ? err.message
                        : "Không thể gửi yêu cầu. Vui lòng thử lại.",
                tone: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!resetToken?.trim()) {
            setStatus({ message: "Mã đặt lại là bắt buộc.", tone: "error" });
            return;
        }
        if (!newPassword || newPassword.length < 8) {
            setStatus({ message: "Mật khẩu mới phải ít nhất 8 ký tự.", tone: "error" });
            return;
        }

        setIsSubmitting(true);
        setStatus(idleStatus);

        try {
            await axiosInstance.post("/auth/reset-password", {
                token: resetToken.trim(),
                newPassword,
            });
            setStatus({
                message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.",
                tone: "success",
            });
            setStep("email");
            setEmail("");
            setNewPassword("");
            setResetToken(null);
        } catch (err) {
            setStatus({
                message:
                    err instanceof Error
                        ? err.message
                        : "Đặt lại mật khẩu thất bại.",
                tone: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-neutral-900">
                    {step === "email" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
                </h2>
                <p className="mt-0.5 text-sm text-neutral-400">
                    {step === "email"
                        ? "Nhập email để nhận mã đặt lại mật khẩu."
                        : "Nhập mã đặt lại và mật khẩu mới."}
                </p>
            </div>

            {step === "email" ? (
                <form className="space-y-4" onSubmit={handleRequestReset} noValidate>
                    <AuthField
                        autoComplete="email"
                        label="Email"
                        name="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email đã đăng ký"
                        value={email}
                    />

                    <FormStatusAlert status={status} />

                    <div className="space-y-2.5">
                        <Button className="w-full" disabled={isSubmitting} size="lg" type="submit" variant="accent">
                            {isSubmitting ? "Đang gửi..." : "Gửi mã đặt lại"}
                        </Button>
                        <Button asChild className="w-full" variant="ghost">
                            <Link to={AUTH_PATHS.login}>← Quay lại đăng nhập</Link>
                        </Button>
                    </div>
                </form>
            ) : (
                <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
                    <AuthField
                        label="Mã đặt lại"
                        name="resetToken"
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Nhập mã đặt lại mật khẩu"
                        value={resetToken ?? ""}
                    />

                    <AuthField
                        autoComplete="new-password"
                        label="Mật khẩu mới"
                        name="newPassword"
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••  (ít nhất 8 ký tự)"
                        value={newPassword}
                    />

                    <FormStatusAlert status={status} />

                    <div className="space-y-2.5">
                        <Button className="w-full" disabled={isSubmitting} size="lg" type="submit" variant="accent">
                            {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </Button>
                        <Button
                            className="w-full"
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                setStep("email");
                                setStatus(idleStatus);
                            }}
                        >
                            Gửi lại mã
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
