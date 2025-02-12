import {
  checkLockoutStatus,
  handleLoginAttempts,
} from "@/lib/helpers/login-attempts";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/auth";
import { handleUnverifiedEmail } from "@/lib/helpers/unverified-email";
import { logActivity } from "../../audit-trail/add-activity/route";
import { validateMethod } from "@/lib/utils/validate-method";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { LoginSchema } from "@/schema/auth.schema";
import { HttpStatus } from "@/config/http.config";
import { Config } from "@/config/app.config";
import { db } from "@/lib/utils/prisma";
import * as OTPAuth from "otpauth";

export async function POST(req: NextRequest) {
  try {
    // VALIDATE HTTP METHOD
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    // PARSE AND VALIDATE REQUEST BODY
    const body = await req.json();
    const { success, data, error } = LoginSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_DATA, details: error.format() },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    const { email, password, code } = data;

    // CHECK IF USER EXISTS
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_INVALID_CREDENTIALS },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK LOCK OUT STATUS
    const { locked, remainingTime } = checkLockoutStatus(email);
    if (locked) {
      return NextResponse.json(
        {
          error: ErrorCode.AUTH_ACCOUNT_LOCKED,
          lockTime: Math.ceil(remainingTime),
        },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // HANDLE PASSWORD VERIFICATION AND FAILED LOGIN ATTEMPTS
    const { verified } = await handleLoginAttempts(email, password, user);
    if (!verified) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_INVALID_CREDENTIALS },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK APP SETTINGS
    const settings = await db.setting.findFirst({
      select: { emailVerificationEnabled: true },
    });
    if (settings?.emailVerificationEnabled) {
      // CHECK EMAIL VERIFICATION STATUS
      if (!user.emailVerified) {
        const verificationToken = await handleUnverifiedEmail(
          user.id,
          user.email,
        );
        return NextResponse.json(
          {
            error: ErrorCode.AUTH_EMAIL_UNVERIFIED,
            verificationToken: verificationToken.token,
          },
          { status: HttpStatus.BAD_REQUEST },
        );
      }
    }

    // HANDLE 2FA IF ENABLED
    if (user.twoFactorEnabled) {
      if (!code) {
        return NextResponse.json(
          { error: ErrorCode.AUTH_2FA_REQUIRED, twoFactor: true },
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
          { error: ErrorCode.AUTH_2FA_INVALID_CODE },
          { status: HttpStatus.BAD_REQUEST },
        );
      }
    }

    // GENERATE ACCESS & REFRESH TOKEN
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(req, user.id);

    // CREATE A RESPONSE OBJECT WITH THE ACCESS TOKEN
    const response = NextResponse.json(
      {
        message: SuccessCode.AUTH_SIGNIN,
        accessToken,
      },
      { status: HttpStatus.OK },
    );

    // SET REFRESH TOKEN IN THE COOKIES
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: Config.REFRESH_COOKIE_EXPIRY,
      path: "/",
    });

    // LOG ACTIVITY
    logActivity(ActionLog.ACCOUNT_SIGNIN, user.id);

    // RETURN THE RESPONSE OBJECT
    return response;
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
