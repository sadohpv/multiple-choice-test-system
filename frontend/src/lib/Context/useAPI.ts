import { useContext } from "react";
import ApiContext from "./ContextApi";
import AuthContext from "./ContextAuth";

export const useApi = () => {
    const ctx = useContext(ApiContext);
    if (!ctx) throw new Error("useApi must be used within ApiProvider");
    return ctx;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
