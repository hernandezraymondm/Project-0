import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/lib/utils/basic-auth";

const prisma = new PrismaClient();

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await decrypt(token);
    if (typeof payload.userId !== "string") {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ enabled: user.twoFactorEnabled });
  } catch (error) {
    console.error("2FA status error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching 2FA status" },
      { status: 500 },
    );
  }
}
