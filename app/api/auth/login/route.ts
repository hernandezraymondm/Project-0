import {
  checkLockoutStatus,
  handleLoginAttempts,
} from "@/lib/helpers/login-attempts";
import { handleUnverifiedEmail } from "@/lib/helpers/unverified-email";
import { validateMethod } from "@/lib/utils/validate-method";
import { logActivity } from "../../logs/add-activity/route";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { ActionLog } from "@/lib/enums/action-log.enum";
import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/schema/auth.schema";
import { HttpStatus } from "@/config/http.config";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { db } from "@/lib/utils/prisma";
import { AuthError } from "next-auth";
import * as OTPAuth from "otpauth";
import { signIn } from "@/auth";

export async function POST(req: NextRequest) {
  // VALIDATE HTTP METHOD
  const methodError = validateMethod(req, "POST");
  if (methodError) return methodError;

  // PARSE AND VALIDATE REQUEST BODY
  const body = await req.json();
  const { success, data, error } = LoginSchema.safeParse(body);
  if (!success) {
    return NextResponse.json(
      { message: ErrorCode.INVALID_DATA, details: error.format() },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  const { email, password, code } = data;

  // CHECK IF USER EXISTS
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json(
      { message: ErrorCode.AUTH_INVALID_CREDENTIALS },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  // CHECK LOCK OUT STATUS
  const { locked, remainingTime } = checkLockoutStatus(email);
  if (locked) {
    return NextResponse.json(
      {
        message: ErrorCode.AUTH_ACCOUNT_LOCKED,
        lockTime: Math.ceil(remainingTime),
      },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  // HANDLE PASSWORD VERIFICATION AND FAILED LOGIN ATTEMPTS
  const { verified } = await handleLoginAttempts(email, password, user);
  if (!verified) {
    return NextResponse.json(
      { message: ErrorCode.AUTH_INVALID_CREDENTIALS },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  // CHECK EMAIL VERIFICATION STATUS
  if (!user.emailVerified) {
    const verificationToken = await handleUnverifiedEmail(user.email);
    return NextResponse.json(
      {
        message: ErrorCode.AUTH_EMAIL_UNVERIFIED,
        verificationToken: verificationToken.token,
      },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  // HANDLE 2FA IF ENABLED
  if (user.twoFactorEnabled) {
    if (!code) {
      return NextResponse.json(
        { message: ErrorCode.AUTH_2FA_REQUIRED, twoFactor: true },
        { status: HttpStatus.OK },
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

    const delta = totp.validate({ token: code });
    if (delta === null) {
      return NextResponse.json(
        { message: ErrorCode.AUTH_2FA_INVALID_CODE },
        { status: HttpStatus.BAD_REQUEST },
      );
    }
  }

  // LOG ACTIVITY
  logActivity(ActionLog.ACCOUNT_SIGNIN, user.id, user.email);

  // PROCEED WITH LOGIN
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    const errorMessage =
      error instanceof AuthError && error.type === "CredentialsSignin"
        ? "Invalid credentials!"
        : "Oops! Something went wrong!";

    return NextResponse.json(
      { error: errorMessage },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }

  return NextResponse.json(
    { message: SuccessCode.AUTH_SIGNIN },
    { status: HttpStatus.OK },
  );
}
