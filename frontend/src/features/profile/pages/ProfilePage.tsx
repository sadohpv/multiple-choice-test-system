import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { AuthField } from "@/features/auth/components/AuthField";
import type { AuthUser, FormStatus } from "@/features/auth/types";
import { useApi, useAuth } from "@/lib/Context/useAPI";
import { axiosInstance } from "@/services/axiosInstance";

const idleStatus: FormStatus = { message: "", tone: "idle" };

export function ProfilePage() {
    const { refreshUser } = useApi();
    const { user } = useAuth();
    const [profile, setProfile] = useState<AuthUser | null>(user);
    const [error, setError] = useState("");

    const [displayname, setDisplayname] = useState(user?.displayname ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [profileStatus, setProfileStatus] = useState<FormStatus>(idleStatus);
    const [passwordStatus, setPasswordStatus] = useState<FormStatus>(idleStatus);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        let mounted = true;

        refreshUser()
            .then(nextUser => {
                if (mounted) {
                    setProfile(nextUser);
                    setDisplayname(nextUser.displayname ?? "");
                }
            })
            .catch(error => {
                if (mounted) {
                    setError(error instanceof Error ? error.message : "Không thể tải profile.");
                }
            });

        return () => {
            mounted = false;
        };
    }, [refreshUser]);

    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        if (!displayname.trim()) {
            setProfileStatus({ message: "Tên hiển thị không được để trống.", tone: "error" });
            return;
        }
        setSavingProfile(true);
        setProfileStatus(idleStatus);
        try {
            await axiosInstance.put("/auth/me/profile", { displayname: displayname.trim() });
            const updated = await refreshUser();
            setProfile(updated);
            setProfileStatus({ message: "Cập nhật thành công!", tone: "success" });
        } catch (err) {
            setProfileStatus({
                message: err instanceof Error ? err.message : "Cập nhật thất bại.",
                tone: "error",
            });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            setPasswordStatus({ message: "Vui lòng điền đầy đủ.", tone: "error" });
            return;
        }
        if (newPassword.length < 8) {
            setPasswordStatus({ message: "Mật khẩu mới phải ít nhất 8 ký tự.", tone: "error" });
            return;
        }
        setSavingPassword(true);
        setPasswordStatus(idleStatus);
        try {
            await axiosInstance.put("/auth/me/password", { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setPasswordStatus({ message: "Đổi mật khẩu thành công!", tone: "success" });
        } catch (err) {
            setPasswordStatus({
                message: err instanceof Error ? err.message : "Đổi mật khẩu thất bại.",
                tone: "error",
            });
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
            {/* Page header */}
            <div className="mb-8 animate-fade-up">
                <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
                <p className="mt-1 text-sm text-neutral-400">Thông tin tài khoản đang đăng nhập.</p>
            </div>

            {error && (
                <Alert className="mb-6 max-w-2xl" tone="error">{error}</Alert>
            )}

            <div className="grid gap-5 max-w-2xl">
                {/* Info card */}
                <section className="rounded-xl border border-neutral-200 bg-white p-6 animate-fade-up delay-100">
                    <h2 className="mb-4 text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                        Thông tin tài khoản
                    </h2>
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <ProfileItem label="Tên hiển thị" value={profile?.displayname ?? "Chưa cập nhật"} />
                        <ProfileItem label="Tên đăng nhập" value={profile?.username ?? "..."} />
                        <ProfileItem label="Email" value={profile?.email ?? "..."} />
                        <ProfileItem label="User ID" value={profile?.id ? String(profile.id) : "..."} />
                    </dl>
                </section>

                {/* Update display name */}
                <section className="rounded-xl border border-neutral-200 bg-white p-6 animate-fade-up delay-200">
                    <h2 className="mb-4 text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                        Cập nhật thông tin
                    </h2>
                    <form className="space-y-4" onSubmit={handleUpdateProfile}>
                        <AuthField
                            label="Tên hiển thị"
                            name="displayname"
                            value={displayname}
                            onChange={e => setDisplayname(e.target.value)}
                            placeholder="Nhập tên hiển thị mới"
                        />
                        {profileStatus.tone !== "idle" && (
                            <Alert tone={profileStatus.tone}>{profileStatus.message}</Alert>
                        )}
                        <Button type="submit" disabled={savingProfile} variant="accent">
                            {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </form>
                </section>

                {/* Change password */}
                <section className="rounded-xl border border-neutral-200 bg-white p-6 animate-fade-up delay-300">
                    <h2 className="mb-4 text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                        Đổi mật khẩu
                    </h2>
                    <form className="space-y-4" onSubmit={handleChangePassword}>
                        <AuthField
                            label="Mật khẩu hiện tại"
                            name="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <AuthField
                            label="Mật khẩu mới"
                            name="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="••••••••  (ít nhất 8 ký tự)"
                        />
                        {passwordStatus.tone !== "idle" && (
                            <Alert tone={passwordStatus.tone}>{passwordStatus.message}</Alert>
                        )}
                        <Button type="submit" disabled={savingPassword} variant="accent">
                            {savingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Button>
                    </form>
                </section>
            </div>
        </main>
    );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-neutral-900">{value}</dd>
        </div>
    );
}
