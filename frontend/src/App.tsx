import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
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

function App() {
    const router = createBrowserRouter([
        {
            element: (
                <ApiProvider>
                    <AuthProvider>
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    </AuthProvider>
                </ApiProvider>
            ),
            // loader: appLoader,
            children: [
                {
                    path: APP_PATHS.practice,
                    element: <PracticePage />,
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
            index: true,
            element: <HomePage />,
        },
        {
            element: (
                <ApiProvider>
                    <GuestRoute>
                        <AuthLayout />
                    </GuestRoute>
                </ApiProvider>
            ),
            children: publicRoutes.map(r => ({
                path: r.path,
                element: <r.component />,
            })),
        },

        {
            path: "*",
            element: <Navigate to={AUTH_PATHS.login} replace />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
