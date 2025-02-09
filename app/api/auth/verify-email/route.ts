import { logActivity } from "../../logs/add-activity/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import * as z from "zod";

const prisma = new PrismaClient();

const verifyEmailSchema = z.object({
  token: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = verifyEmailSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 },
      );
    }

    const result = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
      },
    });

    if (result) {
      logActivity(user.id, "Verified email");
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An error occurred during email verification" },
      { status: 500 },
    );
  }
}
