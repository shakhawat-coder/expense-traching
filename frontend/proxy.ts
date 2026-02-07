import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin-dashboard");
    const isAuthRoute = pathname === "/signin" || pathname === "/signup";

    // 1. Redirect unauthenticated users into signup page
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 2. Role-based protection and auth route handling
    if (token) {
        try {
            const parts = token.split(".");
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                const role = payload.role;

                // Redirect logged-in users away from /signin and /signup
                if (isAuthRoute) {
                    const dest = role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
                    return NextResponse.redirect(new URL(dest, request.url));
                }

                // Prevent non-admins from accessing /admin-dashboard
                if (pathname.startsWith("/admin-dashboard") && role !== "ADMIN") {
                    return NextResponse.redirect(new URL("/dashboard", request.url));
                }
            }
        } catch (e) {
            // If token is invalid, clear it and redirect to signin if accessing protected route
            if (isProtectedRoute) {
                const response = NextResponse.redirect(new URL("/signin", request.url));
                response.cookies.delete("token");
                return response;
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin-dashboard/:path*",
        "/signin",
        "/signup",
    ],
};
