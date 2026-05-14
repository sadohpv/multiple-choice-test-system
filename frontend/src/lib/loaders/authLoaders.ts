import { APP_PATHS, AUTH_PATHS } from "@/constants/path";
import { syncAuthSession } from "@/features/auth/api/auth";
import { readStoredAuthSession } from "@/lib/auth/session";
import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";

export async function protectedRouteLoader({ request }: LoaderFunctionArgs) {
    const session = readStoredAuthSession();
    if (!session?.accessToken || !session.refreshToken) {
        throw redirect(buildLoginRedirect(request.url));
    }

    try {
        await syncAuthSession();
        return null;
    } catch {
        throw redirect(buildLoginRedirect(request.url));
    }
}

export async function adminRouteLoader(args: LoaderFunctionArgs) {
    await protectedRouteLoader(args);

    const roles = readStoredAuthSession()?.user.roles ?? [];
    const canAccessAdmin = roles.some(role => role === "ADMIN" || role === "MOD");

    if (!canAccessAdmin) {
        throw redirect(APP_PATHS.home);
    }

    return null;
}

function buildLoginRedirect(requestUrl: string) {
    const url = new URL(requestUrl);
    const redirectPath = `${url.pathname}${url.search}`;
    return `${AUTH_PATHS.login}?redirect=${encodeURIComponent(redirectPath)}`;
}
