import { AUTH_PATHS } from "@/constants/path";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export const publicRoutes = [
    {
        path: AUTH_PATHS.login.slice(1),
        component: LoginPage,
    },
    {
        path: AUTH_PATHS.register.slice(1),
        component: RegisterPage,
    },
];
