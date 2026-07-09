export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api").replace(/\/$/, "");

export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "").trim();
export const GOOGLE_LOGIN_ENABLED = Boolean(GOOGLE_CLIENT_ID);
