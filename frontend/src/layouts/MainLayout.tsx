import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { useAuth } from "@/features/auth/context/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
    { href: APP_PATHS.home, label: "Home" },
    { href: APP_PATHS.practice, label: "Thi thử" },
    { href: APP_PATHS.history, label: "Lịch sử" },
    { href: APP_PATHS.profile, label: "Profile" },
];

export function MainLayout() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate(APP_PATHS.home, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950">
            <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <Link className="text-lg font-semibold text-zinc-950" to={APP_PATHS.home}>
                        Mezon Exam
                    </Link>

                    <nav className="flex flex-wrap items-center gap-1" aria-label="Điều hướng chính">
                        {navItems.map(item => (
                            <NavLink
                                key={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950",
                                        isActive && "bg-zinc-100 text-zinc-950",
                                    )
                                }
                                end={item.href === APP_PATHS.home}
                                to={item.href}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="hidden max-w-40 truncate text-sm text-zinc-500 sm:inline">
                                    {user?.displayname || user?.username}
                                </span>
                                <Button onClick={handleLogout} variant="outline">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button asChild>
                                <Link to={AUTH_PATHS.login}>Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="border-t border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <span>© 2026 Mezon Exam</span>
                    <span>Học tập rõ ràng, kết quả minh bạch.</span>
                </div>
            </footer>
        </div>
    );
}
