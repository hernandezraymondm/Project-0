import { generateExpirationDate, generateOTP } from "@/lib/utils";
import { getVerificationByEmail } from "@/data/verification";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { verifyReCAPTCHA } from "@/lib/utils/captcha";
import { HttpStatus } from "@/config/http.config";
import { NextResponse } from "next/server";
import { db } from "@/lib/utils/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, captchaToken } = body;

    const reCaptcha = await verifyReCAPTCHA(captchaToken);
    if (!reCaptcha) {
      return NextResponse.json(
        { error: ErrorCode.CAPTCHA_FAILED },
        { status: HttpStatus.UNPROCESSABLE_ENTITY },
      );
    }

    const code = generateOTP(); // Generate a 6-digit code
    const expires = generateExpirationDate(24); // 24 hours

    // CHECK FOR EXISTING VERIFICATION
    const existing = await getVerificationByEmail(email);
    const verification = await db.verification.update({
      where: { id: existing?.id },
      data: { code, expires },
    });

    if (!verification) {
      return NextResponse.json(
        { error: ErrorCode.CAPTCHA_FAILED },
        { status: HttpStatus.UNPROCESSABLE_ENTITY },
      );
    }

    // Send the email
    await sendVerificationEmail(
      verification.email,
      verification.token,
      verification.code,
    );

    // RETURN THE DATA
    return NextResponse.json(
      { message: SuccessCode.VERIFICATION_CODE_RESET },
      { status: HttpStatus.OK },
    );
  } catch (error) {
    console.error("INTERNAL SERVER ERROR:", error);
    return NextResponse.json(
      {
        error: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "AN INTERNAL SERVER ERROR OCCURRED.",
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
