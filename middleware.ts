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

  // HANDLE API AUTH ROUTES
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // HANDLE AUTH ROUTES (LOGIN, REGISTER, ETC.)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // HANDLE UNAUTHORIZED ACCESS TO PROTECTED ROUTES
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // CREATE A NEW HEADERS OBJECT TO OBTAIN THE URL PATH
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
