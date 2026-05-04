import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/features/auth/context/useAuth";
import type { AuthUser } from "@/features/auth/types";

export function ProfilePage() {
    const { refreshUser, user } = useAuth();
    const [profile, setProfile] = useState<AuthUser | null>(user);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        refreshUser()
            .then(nextUser => {
                if (mounted) {
                    setProfile(nextUser);
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

    return (
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-10 sm:px-6">
            <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold text-zinc-950">Profile</h1>
                <p className="mt-2 text-sm text-zinc-500">Thông tin tài khoản đang đăng nhập.</p>
            </div>

            {error ? <Alert className="mt-6 max-w-2xl" tone="error">{error}</Alert> : null}

            <section className="mt-6 max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <dl className="grid gap-4 sm:grid-cols-2">
                    <ProfileItem label="Tên hiển thị" value={profile?.displayname ?? "Chưa cập nhật"} />
                    <ProfileItem label="Tên đăng nhập" value={profile?.username ?? "..."} />
                    <ProfileItem label="Email" value={profile?.email ?? "..."} />
                    <ProfileItem label="User ID" value={profile?.id ? String(profile.id) : "..."} />
                </dl>
            </section>
        </main>
    );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium text-zinc-950">{value}</dd>
        </div>
    );
}
