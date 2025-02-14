import { generatePasswordReset } from "@/lib/helpers/generate-password-reset";
import { getPasswordResetByEmail } from "@/data/password-reset";
import { validateMethod } from "@/lib/utils/validate-method";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendPasswordResetEmail } from "@/lib/utils/mailer";
import { ResetPasswordSchema } from "@/schema/auth.schema";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/config/http.config";
import { getUserByEmail } from "@/data/user";

const EMAIL_COOLDOWN_MS = 20 * 1000; // starts at 20 seconds
const MAX_RESEND_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    // ⚙️ VALIDATE HTTP METHOD
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    const body = await req.json();
    const { success, data, error } = ResetPasswordSchema.safeParse(body);

    // ❌ BLOCK IF ZOD VALIDATION FAILED
    if (!success) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_DATA, details: error.format() },
        { status: HttpStatus.BAD_REQUEST },
      );
    }
    const { email } = data;
    const user = await getUserByEmail(email);

    // ❌ BLOCK IF USER DOESN'T EXIST
    if (!user) {
      return NextResponse.json(
        { error: ErrorCode.BAD_REQUEST },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    const existing = await getPasswordResetByEmail(email);
    const now = Date.now();
    const lastSentTime = new Date(
      existing?.updatedAt || existing?.createdAt || 0,
    ).getTime();
    const remainingCooldown = Math.max(
      0,
      EMAIL_COOLDOWN_MS - (now - lastSentTime),
    );
    // ❌ BLOCK IF COOLDOWN HAS NOT EXPIRED
    if (remainingCooldown > 0) {
      return NextResponse.json(
        {
          error: ErrorCode.TOO_MANY_REQUESTS,
          remainingCooldown,
        },
        { status: HttpStatus.TOO_MANY_REQUESTS },
      );
    }

    // ❌ BLOCK IF MAX RESEND ATTEMPTS REACHED
    if (existing && existing.resendCount >= MAX_RESEND_ATTEMPTS) {
      return NextResponse.json(
        {
          error: ErrorCode.TOO_MANY_REQUESTS,
          remainingCooldown: 0, // No cooldown since they hit the limit
        },
        { status: HttpStatus.TOO_MANY_REQUESTS },
      );
    }

    // ✅ ALLOWED: GENERATE AND SEND RESET EMAIL
    const resendCount = (existing?.resendCount ?? 0) + 1;
    const passwordReset = await generatePasswordReset(
      user.id,
      user.email,
      resendCount,
      existing?.token,
    );
    await sendPasswordResetEmail(
      passwordReset.email,
      passwordReset.token,
      passwordReset.code,
    );

    return NextResponse.json(
      {
        message: SuccessCode.PASSWORD_RESET,
        resendCooldown: EMAIL_COOLDOWN_MS * resendCount,
      },
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
