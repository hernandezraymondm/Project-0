import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { logActivity } from "../../logs/add-activity/route";
import { decrypt } from "@/lib/utils/basic-auth";

const prisma = new PrismaClient();

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await decrypt(token);
    if (typeof decoded.userId !== "string") {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 },
      );
    }
    const result = await prisma.user.update({
      where: { id: decoded.userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    if (result) {
      logActivity(decoded.userId, "Disabled 2FA");
    }

    return NextResponse.json({ message: "2FA has been disabled" });
  } catch (error) {
    console.error("Disable 2FA error:", error);
    return NextResponse.json(
      { error: "An error occurred while disabling 2FA" },
      { status: 500 },
    );
  }
}
