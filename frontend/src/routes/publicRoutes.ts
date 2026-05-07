import { AUTH_PATHS } from "@/constants/path";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

export const publicRoutes = [
    {
        path: AUTH_PATHS.login.slice(1),
        component: LoginPage,
    },
    {
        path: AUTH_PATHS.register.slice(1),
        component: RegisterPage,
    },
    {
        path: AUTH_PATHS.forgotPassword.slice(1),
        component: ForgotPasswordPage,
    },
];
