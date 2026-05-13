import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";
import { register, login, getCurrentUser, logout as apiLogout } from "../features/auth/api/auth";
import type { AuthSession, AuthUser, LoginFormValues, RegisterFormValues } from "@/features/auth/types";
import type { ISubjectEntity } from "@/constants/entity";

export const apiService = {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const res = await axiosInstance.get<T>(url, config);
        return res.data;
    },

    post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const res = await axiosInstance.post<T>(url, data, config);
        return res.data;
    },

    put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const res = await axiosInstance.put<T>(url, data, config);
        return res.data;
    },

    del: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const res = await axiosInstance.delete<T>(url, config);
        return res.data;
    },

    register: async (values: RegisterFormValues): Promise<AuthSession> => {
        return register(values);
    },

    login: async (values: LoginFormValues): Promise<AuthSession> => {
        return login(values);
    },

    refreshUser: async (): Promise<AuthUser> => {
        return getCurrentUser();
    },

    logout: async (): Promise<void> => {
        await apiLogout();
    },

    fetchAllSubject: async (): Promise<ISubjectEntity[]> => {
        const res = await axiosInstance.get<ISubjectEntity[]>("/subjects");
        return res.data;
    },
    createSubject: async ({ subjectName, slug }: { subjectName: string; slug?: string }): Promise<ISubjectEntity[]> => {
        const res = await axiosInstance.post("/subjects", {
            name: subjectName,
            slug,
        });
        return res.data;
    },
    deleteSubject: async ({ id }: { id: string }): Promise<void> => {
        const res = await axiosInstance.delete(`/subjects/${id}`);
        return res.data;
    },
};
