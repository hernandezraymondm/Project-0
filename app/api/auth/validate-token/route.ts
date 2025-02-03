import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json(
      { valid: false, message: "No token" },
      { status: 401 }
    );
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    if (typeof payload.userId !== "string") {
      return NextResponse.json(
        { valid: false, reason: "invalid payload" },
        { status: 401 }
      );
    }

    // Check if the user has an active refresh token (Global Logout Handling)
    const activeSession = await prisma.refreshToken.findFirst({
      where: { userId: payload.userId },
    });

    if (!activeSession) {
      return NextResponse.json(
        { valid: false, reason: "session invalidated (global logout)" },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true, payload }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === "JWTExpired") {
      return NextResponse.json(
        { valid: false, reason: "expired" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { valid: false, reason: "invalid" },
      { status: 401 }
    );
  }
}
