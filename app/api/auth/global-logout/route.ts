import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Optionally invalidate the refresh token in the database
  if (refreshToken) {
    try {
      const secretKey = new TextEncoder().encode(
        process.env.REFRESH_TOKEN_SECRET
      );
      const { payload } = await jwtVerify(refreshToken, secretKey);

      if (typeof payload.userId !== "string") {
        return NextResponse.json(
          { message: "Invalid token payload" },
          { status: 401 }
        );
      }

      await prisma.refreshToken.deleteMany({
        where: { userId: payload.userId },
      });
    } catch (error) {
      console.error("Error invalidating refresh token:", error);
    }
  }

  const response = NextResponse.json(
    { message: "You have successfully logged out from all devices." },
    { status: 200 }
  );

  // Clear the cookies
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}

/** TODO:
 * Detecting suspicious login activities.
 * Logout from all devices
 * See active devices
 */
