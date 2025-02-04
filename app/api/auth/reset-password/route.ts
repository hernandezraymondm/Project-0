import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import { Resend } from "resend";
import ResetPasswordEmail from "@/components/emails/reset-password-email";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = resetPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "If the email exists, a reset link has been sent." },
        { status: 200 },
      );
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Password",
      react: ResetPasswordEmail({ resetUrl }),
    });

    return NextResponse.json(
      { message: "If the email exists, a reset link has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
