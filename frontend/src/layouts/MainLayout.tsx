import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { cn } from "@/lib/utils";
import { useApi, useAuth } from "@/lib/Context/useAPI";

const navItems = [
    { href: APP_PATHS.home, label: "Home" },
    { href: APP_PATHS.practice, label: "Practice" },
    { href: APP_PATHS.history, label: "History" },
    { href: APP_PATHS.profile, label: "Profile" },
    { href: APP_PATHS.subject, label: "Subject" },
];

export function MainLayout() {
    const navigate = useNavigate();
    const api = useApi();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = (user?.roles ?? []).some(role => role === "ADMIN" || role === "MOD");

    const handleLogout = async () => {
        try {
            await api.logout();
        } finally {
            navigate(APP_PATHS.home, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f8f8] text-neutral-900">
            <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
                    <Link
                        to={APP_PATHS.home}
                        className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 transition-colors hover:text-indigo-600">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                            M
                        </span>
                        Mezon Exam
                    </Link>

                    <nav className="hidden items-center gap-0.5 sm:flex" aria-label="Điều hướng chính">
                        {navItems.map(item => {
                            if (item.href === APP_PATHS.profile && !isAuthenticated) return null;
                            return (
                                <NavLink
                                    key={item.href}
                                    end={item.href === APP_PATHS.home}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        cn(
                                            "rounded-md px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900",
                                            isActive && "bg-neutral-100 text-neutral-900 font-medium",
                                        )
                                    }>
                                    {item.label}
                                </NavLink>
                            );
                        })}
                        {isAdmin ? (
                            <NavLink
                                key="/admin"
                                to="/admin"
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-md px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50",
                                        isActive && "bg-indigo-50",
                                    )
                                }>
                                Admin
                            </NavLink>
                        ) : null}
                    </nav>

                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <span className="hidden max-w-32 truncate text-xs text-neutral-400 sm:inline">
                                    {user?.displayname || user?.username}
                                </span>
                                <Button onClick={handleLogout} variant="outline" size="sm">
                                    Đăng xuất
                                </Button>
                            </>
                        ) : (
                            <Button asChild size="sm" variant="accent">
                                <Link to={AUTH_PATHS.login}>Đăng nhập</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="border-t border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 text-xs text-neutral-400">
                    <span>© 2026 Mezon Exam</span>
                    <span>Học tập rõ ràng, kết quả minh bạch.</span>
                </div>
            </footer>
        </div>
    );
}
