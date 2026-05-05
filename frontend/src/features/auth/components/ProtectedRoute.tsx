import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { useAuth } from "@/lib/Context/useAPI";

type RouteGuardProps = {
    children: ReactNode;
};

export function ProtectedRoute({ children }: RouteGuardProps) {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate replace state={{ from: location }} to={AUTH_PATHS.login} />;
    }

    return children;
}

export function GuestRoute({ children }: RouteGuardProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate replace to={APP_PATHS.home} />;
    }

    return children;
}
