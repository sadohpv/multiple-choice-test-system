import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { GuestRoute, ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { HomePage } from "@/features/home/pages/HomePage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { ContributeQuestionPage } from "@/features/user-flow/pages/ContributeQuestionPage";
import { HistoryPage } from "@/features/user-flow/pages/HistoryPage";
import { PracticePage } from "@/features/user-flow/pages/PracticePage";
import { ResultsPage } from "@/features/user-flow/pages/ResultsPage";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { publicRoutes } from "./routes";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route
                            path={APP_PATHS.practice.slice(1)}
                            element={
                                <ProtectedRoute>
                                    <PracticePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={APP_PATHS.history.slice(1)}
                            element={
                                <ProtectedRoute>
                                    <HistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={APP_PATHS.results.slice(1)}
                            element={
                                <ProtectedRoute>
                                    <ResultsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={APP_PATHS.contribute.slice(1)}
                            element={
                                <ProtectedRoute>
                                    <ContributeQuestionPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={APP_PATHS.profile.slice(1)}
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route
                        element={
                            <GuestRoute>
                                <AuthLayout />
                            </GuestRoute>
                        }>
                        {publicRoutes.map(route => (
                            <Route key={route.path} path={route.path} element={<route.component />} />
                        ))}
                    </Route>

                    <Route path="*" element={<Navigate replace to={AUTH_PATHS.login} />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
