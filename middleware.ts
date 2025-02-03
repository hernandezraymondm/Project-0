import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  // Allow public routes
  if (
    request.nextUrl.pathname.startsWith("/") ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/verify-email") ||
    request.nextUrl.pathname.startsWith("/reset-password") ||
    request.nextUrl.pathname.startsWith("/new-password")
  ) {
    return NextResponse.next();
  }

  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token!, secretKey);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof Error && error.name === "JWTExpired") {
      // Attempt to refresh the token
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("Cookie") || "",
          },
        }
      );

      if (response.ok) {
        const newResponse = NextResponse.next();
        newResponse.headers.set(
          "Set-Cookie",
          response.headers.get("Set-Cookie") || ""
        );
        return newResponse;
      }
    }

    // If token refresh fails or for any other error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
