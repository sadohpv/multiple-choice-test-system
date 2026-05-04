import { Outlet } from "react-router-dom";

export function MainLayout() {
    console.log("Here");
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <a
                        href="/main/subject"
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        📘 Subject
                    </a>

                    <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        📝 Exam
                    </a>

                    <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        👤 User
                    </a>

                    <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                        🛡️ Role
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-700 text-sm text-gray-400">© 2026 System</div>
            </aside>

            <main className="flex-1 bg-gray-100 p-6">
                <Outlet />
            </main>
        </div>
    );
}
