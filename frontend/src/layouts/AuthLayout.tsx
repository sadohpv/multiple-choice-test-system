import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AUTH_PATHS } from "@/constants/path";
import { cn } from "@/lib/utils";

const tabs = [
    { href: AUTH_PATHS.login, label: "Đăng nhập" },
    { href: AUTH_PATHS.register, label: "Đăng ký" },
];

export function AuthLayout() {
    const location = useLocation();

    return (
        <main className="min-h-screen bg-zinc-100 px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
                <Card className="w-full">
                    <CardHeader className="space-y-4 pb-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                                Mezon Campus
                            </p>
                            <CardTitle>Tài khoản</CardTitle>
                        </div>

                        <nav className="grid grid-cols-2 rounded-lg bg-zinc-100 p-1" aria-label="Điều hướng xác thực">
                            {tabs.map(tab => {
                                const isActive = location.pathname === tab.href;

                                return (
                                    <Link
                                        key={tab.href}
                                        className={cn(
                                            "rounded-md px-3 py-2 text-center text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-white text-zinc-950 shadow-sm"
                                                : "text-zinc-500 hover:text-zinc-950",
                                        )}
                                        to={tab.href}
                                    >
                                        {tab.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </CardHeader>

                    <CardContent>
                        <Outlet />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
