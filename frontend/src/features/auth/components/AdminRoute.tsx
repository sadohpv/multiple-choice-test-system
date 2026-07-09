import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { APP_PATHS } from "@/constants/path";
import { useAuth } from "@/lib/Context/useAPI";

type AdminRouteProps = {
    children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const roles = user?.roles ?? [];
    const isAdmin = roles.some(role => role === "ADMIN" || role === "MOD");

    if (!isAuthenticated || !isAdmin) {
        return <Navigate replace state={{ from: location }} to={APP_PATHS.home} />;
    }

    return children;
}
