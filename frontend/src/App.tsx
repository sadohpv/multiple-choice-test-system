import { AUTH_PATHS } from "@/constants/path";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { publicRoutes } from "./routes";
import { MainLayout } from "./layouts/MainLayout";
import { SubjectPage } from "./features/subjects/pages/SubjectPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route index element={<Navigate replace to={AUTH_PATHS.login} />} />
                    {publicRoutes.map(route => (
                        <Route key={route.path} path={route.path} element={<route.component />} />
                    ))}
                </Route>
                <Route path="/main" element={<MainLayout />}>
                    <Route path="subject" element={<SubjectPage />}></Route>
                </Route>
                <Route path="*" element={<Navigate replace to={AUTH_PATHS.login} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
