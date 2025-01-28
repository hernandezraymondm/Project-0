import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (
    (token && request.nextUrl.pathname.startsWith("/login")) ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow public access to login, register, and blog posts
  if (request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.next();
  }

  // Redirect to login if no token is present
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token is valid and user is trying to access login or register, redirect to dashboard

  // For all other routes, allow access if token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
