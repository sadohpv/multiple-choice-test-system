<<<<<<< HEAD
<<<<<<< HEAD
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
} from "react-router-dom";
=======
import { createBrowserRouter, Navigate, RouterProvider, Outlet } from "react-router-dom"; // Nhớ import thêm Outlet
>>>>>>> origin/develop
=======
import { createBrowserRouter, Navigate, RouterProvider, Outlet } from "react-router-dom"; // Nhớ import thêm Outlet
>>>>>>> 681270c2958d931e2775a73de7e61076aa1203a4
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
import { ApiProvider } from "./lib/Context/ContextApi";
import { AuthLayout } from "./layouts/AuthLayout";
import { AuthProvider } from "./lib/Context/ContextAuth";
import { practiceLoader } from "./lib/loaders/practiceLoader";
import { AdminRoute } from "@/features/auth/components/AdminRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { UserManagementPage } from "@/features/admin/pages/UserManagementPage";
import { RoleManagementPage } from "@/features/admin/pages/RoleManagementPage";
import { SubjectPage } from "./features/subjects/pages/SubjectPage";
import { ModalProvider } from "react-modal-hook";

function App() {
    const router = createBrowserRouter([
        {
            element: (
                <ApiProvider>
                    <AuthProvider>
                        <ModalProvider>
                            <Outlet />
                        </ModalProvider>
                    </AuthProvider>
                </ApiProvider>
            ),
            children: [
                // Home Page
                {
                    index: true,
                    element: <HomePage />,
                },

                // Protected App Routes
                {
                    loader: practiceLoader,
                    element: (
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        {
                            path: APP_PATHS.practice,
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

                // Admin Routes
                {
                    path: "/admin",
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
                                    <p className="text-sm text-neutral-400">Chọn một mục ở menu bên trái để bắt đầu.</p>
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

                // Guest / Auth Routes
                {
                    element: (
                        <GuestRoute>
                            <AuthLayout />
                        </GuestRoute>
                    ),
                    children: publicRoutes.map(r => ({
                        path: r.path,
                        element: <r.component />,
                    })),
                },

                // 5. Fallback Route
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
