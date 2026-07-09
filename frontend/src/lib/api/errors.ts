import { AxiosError } from "axios";

export function extractErrorMessage(payload: unknown, fallback: string) {
    if (typeof payload === "string" && payload.trim()) {
        return payload;
    }

    if (payload && typeof payload === "object") {
        const objectPayload = payload as Record<string, unknown>;

        if (typeof objectPayload.message === "string" && objectPayload.message.trim()) {
            return objectPayload.message;
        }

        if (typeof objectPayload.error === "string" && objectPayload.error.trim()) {
            return objectPayload.error;
        }
    }

    return fallback;
}

export function resolveApiError(error: unknown, fallback: string) {
    if (error instanceof AxiosError) {
        return extractErrorMessage(error.response?.data, fallback);
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
