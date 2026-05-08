import { Link, NavLink, Outlet } from "react-router-dom";
import { APP_PATHS } from "@/constants/path";
import { cn } from "@/lib/utils";

const adminNavItems = [
    { href: "/admin", label: "Dashboard", end: true, icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
    )},
    { href: "/admin/users", label: "Người dùng", end: false, icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
    )},
    { href: "/admin/roles", label: "Phân quyền", end: false, icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
    )},
];

export function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-[#f8f8f8] text-neutral-900">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white">
                <div className="sticky top-0 p-4">
                    {/* Brand */}
                    <Link
                        to={APP_PATHS.home}
                        className="mb-6 flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-indigo-600 transition-colors"
                    >
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">M</span>
                        Admin
                    </Link>

                    <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                        Quản lý
                    </p>

                    <nav className="flex flex-col gap-0.5">
                        {adminNavItems.map(item => (
                            <NavLink
                                key={item.href}
                                end={item.end}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
                                        isActive && "bg-indigo-50 text-indigo-700 font-medium"
                                    )
                                }
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-6 border-t border-neutral-100 pt-4">
                        <Link
                            to={APP_PATHS.home}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
                        >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}
