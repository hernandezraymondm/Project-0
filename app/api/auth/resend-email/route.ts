import { logActivity } from "../../audit-trail/add-activity/route";
import { generateExpirationDate, generateOTP } from "@/lib/utils";
import { validateMethod } from "@/lib/utils/validate-method";
import { getVerificationByEmail } from "@/data/verification";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { verifyReCAPTCHA } from "@/lib/utils/captcha";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";

const EMAIL_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RESEND_ATTEMPTS = 5;

async function resendVerificationEmail(email: string) {
  const code = generateOTP();
  const expires = generateExpirationDate(24); // 24 hours

  try {
    const existing = await getVerificationByEmail(email);
    if (!existing) {
      return { error: ErrorCode.NOT_FOUND, status: HttpStatus.NOT_FOUND };
    }

    const now = Date.now();
    const lastSentTime = new Date(
      existing.updatedAt || existing.createdAt,
    ).getTime();
    const remainingCooldown = Math.max(
      0,
      EMAIL_COOLDOWN_MS - (now - lastSentTime),
    );

    // ❌ BLOCK IF COOLDOWN HAS NOT EXPIRED
    if (existing.resendCount !== 0 && remainingCooldown > 0) {
      return {
        error: ErrorCode.TOO_MANY_REQUESTS,
        remainingCooldown,
        status: HttpStatus.TOO_MANY_REQUESTS,
      };
    }

    // ❌ BLOCK IF MAX RESEND ATTEMPTS REACHED
    if (existing.resendCount >= MAX_RESEND_ATTEMPTS) {
      return {
        error: ErrorCode.TOO_MANY_REQUESTS,
        remainingCooldown: 0, // No cooldown since they hit the limit
        status: HttpStatus.TOO_MANY_REQUESTS,
      };
    }

    // ✅ ALLOWED: PROCEED WITH RECORD UPDATE
    const updatedRecord = await db.verification.update({
      where: { id: existing.id },
      data: {
        code,
        expires,
        updatedAt: new Date(),
        resendCount: existing.resendCount + 1, // Always increment
      },
    });

    // ❌ BLOCK IF RECORD IS NOT UPDATED
    if (!updatedRecord) {
      return {
        error: ErrorCode.INTERNAL_SERVER_ERROR,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // ✅ ALLOWED: SEND VERIFICATION EMAIL
    await sendVerificationEmail(
      updatedRecord.email,
      updatedRecord.token,
      updatedRecord.code,
    );
    logActivity(ActionLog.RESEND_VERIFICATION_EMAIL, updatedRecord.userId);

    return {
      message: SuccessCode.EMAIL_SENT,
      resendCooldown: EMAIL_COOLDOWN_MS, // Reset cooldown after success
      status: HttpStatus.OK,
    };
  } catch (error) {
    console.error("ERROR RESENDING VERIFICATION EMAIL:", error);
    return {
      error: ErrorCode.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    // ⚙️ VALIDATE HTTP METHOD
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    const { email, captchaToken } = await req.json();

    // ❌ BLOCK IF NO BODY
    if (!email || !captchaToken) {
      return NextResponse.json(
        { error: ErrorCode.BAD_REQUEST },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // ❌ BLOCK IF CAPTCHA FAILED
    const reCaptcha = await verifyReCAPTCHA(captchaToken);
    if (!reCaptcha) {
      return NextResponse.json(
        { error: ErrorCode.CAPTCHA_FAILED },
        { status: HttpStatus.UNPROCESSABLE_ENTITY },
      );
    }

    const response = await resendVerificationEmail(email);
    return NextResponse.json(response, { status: response.status });
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
