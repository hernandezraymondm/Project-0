import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token provided" },
      { status: 401 }
    );
  }

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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const accessToken = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json(
      { message: "Token refreshed successfully" },
      { status: 200 }
    );

    response.cookies.set("session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900, // 15 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
