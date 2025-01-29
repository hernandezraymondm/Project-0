import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as OTPAuth from "otpauth";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { logActivity } from "../../logs/add-activity/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token: otpToken } = await req.json();
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "User not found or 2FA not set up" },
        { status: 404 }
      );
    }

    const totp = new OTPAuth.TOTP({
      issuer: "YourAppName",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: user.twoFactorSecret,
    });

    const delta = totp.validate({ token: otpToken });

    if (delta !== null) {
      const result = await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true },
      });

      if (result) {
        logActivity(user.id, "Enabled 2FA");
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verify 2FA error:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying 2FA" },
      { status: 500 }
    );
  }
}
