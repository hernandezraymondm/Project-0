import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Optionally invalidate the refresh token in the database
  if (refreshToken) {
    try {
      // Assuming you have a RefreshToken model in your Prisma schema
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
    } catch (error) {
      console.error("Error invalidating refresh token:", error);
    }
  }

  const response = NextResponse.json(
    { message: "Logout successful" },
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
