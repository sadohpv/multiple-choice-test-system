export type FormStatus = {
    message: string;
    tone: "idle" | "success" | "error";
};

export type AuthUser = {
    id: number;
    username: string;
    displayname: string | null;
    avatar: string | null;
    email: string;
    createdAt: number | null;
    updatedAt: number | null;
};

export type AuthSession = {
    tokenType: "Bearer" | string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    user: AuthUser;
};

export type LoginFormValues = {
    identity: string;
    password: string;
};

export type RegisterFormValues = {
    username: string;
    displayName: string;
    email: string;
    password: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type AuthMessageResponse = {
    message: string;
};
