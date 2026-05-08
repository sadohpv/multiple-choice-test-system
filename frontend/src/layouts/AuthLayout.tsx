import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { cn } from "@/lib/utils";

const tabs = [
    { href: AUTH_PATHS.login, label: "Đăng nhập" },
    { href: AUTH_PATHS.register, label: "Đăng ký" },
];

export function AuthLayout() {
    const location = useLocation();

    return (
        <main className="min-h-screen bg-white px-4 py-12">
            <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-sm items-center">
                <div className="w-full animate-fade-up">
                    {/* Brand + back link */}
                    <div className="mb-8 text-center">
                        <Link
                            to={APP_PATHS.home}
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-4"
                        >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Về trang chủ
                        </Link>
                        <div>
                            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
                                M
                            </span>
                            <p className="mt-3 text-sm font-semibold text-neutral-900">Mezon Exam</p>
                            <p className="mt-0.5 text-xs text-neutral-400">Nền tảng luyện thi trực tuyến</p>
                        </div>
                    </div>

                    <Card className="w-full">
                        <CardHeader className="pb-0 pt-5 px-5">
                            {/* Tab switcher */}
                            <nav
                                className="grid grid-cols-2 gap-1 rounded-lg bg-neutral-100 p-1"
                                aria-label="Điều hướng xác thực"
                            >
                                {tabs.map(tab => {
                                    const isActive = location.pathname === tab.href;
                                    return (
                                        <Link
                                            key={tab.href}
                                            to={tab.href}
                                            className={cn(
                                                "rounded-md px-3 py-1.5 text-center text-sm font-medium transition-all duration-150",
                                                isActive
                                                    ? "bg-white text-neutral-900 shadow-sm"
                                                    : "text-neutral-500 hover:text-neutral-700"
                                            )}
                                        >
                                            {tab.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </CardHeader>

                        <CardContent className="px-5 pb-5 pt-5">
                            <Outlet />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
