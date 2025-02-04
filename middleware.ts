import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, updateSession } from "./lib/utils/basic-auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  // Allow public routes
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/verify-email") ||
    request.nextUrl.pathname.startsWith("/reset-password") ||
    request.nextUrl.pathname.startsWith("/new-password")
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Refresh session token for dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      const response = await updateSession(request);
      return response || NextResponse.next();
    } catch (error) {
      console.error("Session refresh failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For other protected routes, just verify the token
  try {
    await decrypt(token); // Verify the token
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
