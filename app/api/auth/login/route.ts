import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { sign } from "jsonwebtoken";
import * as OTPAuth from "otpauth";
import { logActivity } from "../../logs/add-activity/route";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  otpToken: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, otpToken } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 400 }
      );
    }

    if (user.twoFactorEnabled) {
      if (!otpToken) {
        return NextResponse.json(
          { message: "2FA required", require2FA: true },
          { status: 200 }
        );
      }

      const totp = new OTPAuth.TOTP({
        issuer: "YourAppName",
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: user.twoFactorSecret!,
      });

      const delta = totp.validate({ token: otpToken });

      if (delta === null) {
        return NextResponse.json(
          { message: "Invalid 2FA token" },
          { status: 400 }
        );
      }
    }

    const token = sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    logActivity(user.id, "Logged in");

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
