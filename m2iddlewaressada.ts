// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const session = request.cookies.get("session")?.value;

//   if (!session && !request.nextUrl.pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (session && request.nextUrl.pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login"],
// };
