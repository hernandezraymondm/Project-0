import { decrypt } from "@/lib/utils/basic-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as OTPAuth from "otpauth";

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
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totp = new OTPAuth.TOTP({
      issuer: process.env.NEXT_PUBLIC_APP_NAME,
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: new OTPAuth.Secret(),
    });

    const secret = totp.secret.base32;
    const otpauth = totp.toString();

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    return NextResponse.json({ secret, otpauth });
  } catch (error) {
    console.error("ENABLING 2FA ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while enabling 2FA" },
      { status: 500 },
    );
  }
}
