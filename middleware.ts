import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/config/routes";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = !!refreshToken;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(`^${route.replace(/\*/g, ".*")}$`).test(nextUrl.pathname),
  );
  const isAuthRoute = authRoutes.some((route) =>
    new RegExp(`^${route.replace(/\*/g, ".*")}$`).test(nextUrl.pathname),
  );

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
