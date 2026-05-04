/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useMemo } from "react";
import { axiosInstance } from "../../services/axiosInstance";

type ApiContextType = {
    get: <T = any>(url: string, config?: any) => Promise<T>;
    post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    del: <T = any>(url: string, config?: any) => Promise<T>;
};

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const api = useMemo(
        () => ({
            get: async <T,>(url: string, config?: any): Promise<T> => {
                const res = await axiosInstance.get<T>(url, config);
                return res.data;
            },

            post: async <T,>(url: string, data?: any, config?: any): Promise<T> => {
                const res = await axiosInstance.post<T>(url, data, config);
                return res.data;
            },

            put: async <T,>(url: string, data?: any, config?: any): Promise<T> => {
                const res = await axiosInstance.put<T>(url, data, config);
                return res.data;
            },

            del: async <T,>(url: string, config?: any): Promise<T> => {
                const res = await axiosInstance.delete<T>(url, config);
                return res.data;
            },
        }),
        [],
    );

    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
export default ApiContext;
