import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { ModalProvider } from "react-modal-hook";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { GuestRoute, ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { HomePage } from "@/features/home/pages/HomePage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { ContributeQuestionPage } from "@/features/user-flow/pages/ContributeQuestionPage";
import { HistoryPage } from "@/features/user-flow/pages/HistoryPage";
import { PracticePage } from "@/features/user-flow/pages/PracticePage";
import { ResultsPage } from "@/features/user-flow/pages/ResultsPage";
import { publicRoutes } from "./routes";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { AuthProvider } from "./lib/Context/ContextAuth";
import { adminRouteLoader, protectedRouteLoader } from "./lib/loaders/authLoaders";
import { practiceLoader } from "./lib/loaders/practiceLoader";
import { AdminRoute } from "@/features/auth/components/AdminRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { UserManagementPage } from "@/features/admin/pages/UserManagementPage";
import { RoleManagementPage } from "@/features/admin/pages/RoleManagementPage";
import { SubjectPage } from "./features/subjects/pages/SubjectPage";

function App() {
    const router = createBrowserRouter([
        {
            element: (
                <AuthProvider>
                    <ModalProvider>
                        <Outlet />
                    </ModalProvider>
                </AuthProvider>
            ),
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    loader: protectedRouteLoader,
                    element: (
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        {
                            path: APP_PATHS.practice,
                            loader: practiceLoader,
                            element: <PracticePage />,
                        },
                        {
                            path: APP_PATHS.subject,
                            element: <SubjectPage />,
                        },
                        {
                            path: APP_PATHS.history,
                            element: <HistoryPage />,
                        },
                        {
                            path: APP_PATHS.results,
                            element: <ResultsPage />,
                        },
                        {
                            path: APP_PATHS.contribute,
                            element: <ContributeQuestionPage />,
                        },
                        {
                            path: APP_PATHS.profile,
                            element: <ProfilePage />,
                        },
                    ],
                },
                {
                    path: "/admin",
                    loader: adminRouteLoader,
                    element: (
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    ),
                    children: [
                        {
                            index: true,
                            element: (
                                <div className="animate-fade-up rounded-xl border border-neutral-200 bg-white p-8 text-center">
                                    <p className="text-sm text-neutral-400">
                                        Chọn một mục ở menu bên trái để bắt đầu.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            path: "users",
                            element: <UserManagementPage />,
                        },
                        {
                            path: "roles",
                            element: <RoleManagementPage />,
                        },
                    ],
                },
                {
                    element: (
                        <GuestRoute>
                            <AuthLayout />
                        </GuestRoute>
                    ),
                    children: publicRoutes.map(route => ({
                        path: route.path,
                        element: <route.component />,
                    })),
                },
                {
                    path: "*",
                    element: <Navigate to={AUTH_PATHS.login} replace />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
