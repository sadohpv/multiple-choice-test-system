/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axiosInstance";
import { register, login, getCurrentUser, logout as apiLogout } from "../features/auth/api/auth";
import type { AuthSession, AuthUser, LoginFormValues, RegisterFormValues } from "@/features/auth/types";
import type { ISubjectEntity } from "@/constants/entity";

export const apiService = {
    // Các hàm helper cơ bản
    get: async <T = any>(url: string, config?: any): Promise<T> => {
        const res = await axiosInstance.get<T>(url, config);
        return res.data;
    },

    post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
        const res = await axiosInstance.post<T>(url, data, config);
        return res.data;
    },

    put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
        const res = await axiosInstance.put<T>(url, data, config);
        return res.data;
    },

    del: async <T = any>(url: string, config?: any): Promise<T> => {
        const res = await axiosInstance.delete<T>(url, config);
        return res.data;
    },

    // Logic Auth
    register: async (values: RegisterFormValues): Promise<AuthSession> => {
        return await register(values);
    },

    login: async (values: LoginFormValues): Promise<AuthSession> => {
        return await login(values);
    },

    refreshUser: async (): Promise<AuthUser> => {
        return await getCurrentUser();
    },

    logout: async (): Promise<void> => {
        await apiLogout();
    },

    // Logic Business
    fetchAllSubject: async (): Promise<ISubjectEntity[]> => {
        const res = await axiosInstance.get<ISubjectEntity[]>("/subjects");
        // Quan trọng: Phải lấy .data vì axios trả về response object
        return res.data;
    },
};
