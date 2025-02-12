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
  const isLoggedIn = !!refreshToken; // CHECK IF USER IS LOGGED IN

  // CHECK IF THE CURRENT ROUTE IS AN API AUTH ROUTE
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // CHECK IF THE CURRENT ROUTE IS A PUBLIC ROUTE
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(`^${route.replace(/\*/g, ".*")}$`).test(nextUrl.pathname),
  );

  // CHECK IF THE CURRENT ROUTE IS AN AUTH ROUTE (LOGIN, REGISTER, ETC.)
  const isAuthRoute = authRoutes.some((route) =>
    new RegExp(`^${route.replace(/\*/g, ".*")}$`).test(nextUrl.pathname),
  );

  // HANDLE API AUTH ROUTES
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // HANDLE AUTH ROUTES (LOGIN, REGISTER, ETC.)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // REDIRECT LOGGED-IN USERS AWAY FROM AUTH ROUTES
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // ALLOW NON-LOGGED-IN USERS TO ACCESS AUTH ROUTES
    return NextResponse.next();
  }

  // HANDLE UNAUTHORIZED ACCESS TO PROTECTED ROUTES
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // ALLOW ACCESS TO PUBLIC ROUTES AND PROTECTED ROUTES FOR LOGGED-IN USERS
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
