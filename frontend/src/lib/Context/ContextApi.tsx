/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useMemo } from "react";
import { axiosInstance } from "../../services/axiosInstance";
import type { AuthSession, AuthUser, LoginFormValues, RegisterFormValues } from "@/features/auth/types";
import { register, login, getCurrentUser, logout } from "../../features/auth/api/auth";
import type { SubjectEntity } from "@/constants/entity";
type ApiContextType = {
    get: <T = any>(url: string, config?: any) => Promise<T>;
    post: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: any) => Promise<T>;
    del: <T = any>(url: string, config?: any) => Promise<T>;
    register: (values: RegisterFormValues) => Promise<AuthSession>;
    refreshUser: () => Promise<AuthUser>;
    login: (values: LoginFormValues) => Promise<AuthSession>;
    logout: () => Promise<void>;
    fetchAllSubject: () => Promise<SubjectEntity[]>;
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
            register: async (values: RegisterFormValues) => {
                const nextSession = await register(values);
                return nextSession;
            },
            login: async (values: LoginFormValues) => {
                const nextSession = await login(values);
                return nextSession;
            },
            refreshUser: async () => {
                const user = await getCurrentUser();
                return user;
            },
            logout: async () => {
                await logout();
            },
            fetchAllSubject: async () => {
                const res: SubjectEntity[] = await axiosInstance.get("/subjects");
                console.log("res: ", res);
                return res;
            },
        }),
        [],
    );

    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
export default ApiContext;
