import { Navigate, useLocation } from "react-router-dom";
import { APP_PATHS } from "@/constants/path";
import { useAuth } from "@/lib/Context/useAPI";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/axiosInstance";

export function AdminRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setIsAdmin(false);
            return;
        }

        // Check if user has ADMIN or MOD role via max_role_level API
        // For simplicity, we query the role level. Or we can just check if get users succeeds.
        axiosInstance.get(`/roles/max-role-level/${user.id}`)
            .then(res => {
                // If role level >= 50 (for instance, Admin/Mod)
                setIsAdmin(res.data >= 50);
            })
            .catch(() => setIsAdmin(false));
    }, [isAuthenticated, user]);

    if (isAdmin === null) return <div className="p-4 text-center">Đang kiểm tra quyền...</div>;

    if (!isAdmin) {
        return <Navigate replace state={{ from: location }} to={APP_PATHS.home} />;
    }

    return children;
}
