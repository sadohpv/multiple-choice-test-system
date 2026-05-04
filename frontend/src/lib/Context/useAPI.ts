import { useContext } from "react";
import ApiContext from "./ContextApi";

export const useApi = () => {
    const ctx = useContext(ApiContext);
    if (!ctx) throw new Error("useApi must be used within ApiProvider");
    return ctx;
};
