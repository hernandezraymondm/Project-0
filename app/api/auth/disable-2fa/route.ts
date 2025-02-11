import { logActivity } from "../../audit-trail/add-activity/route";
import { decrypt } from "@/lib/utils/basic-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
      logActivity("Disabled 2FA", decoded.userId);
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
