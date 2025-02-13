import { getPasswordResetByToken } from "@/data/password-reset";
import { validateMethod } from "@/lib/utils/validate-method";
import { getVerificationByToken } from "@/data/verification";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { VerifyLinkSchema } from "@/schema/auth.schema";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/config/http.config";

export async function POST(req: NextRequest) {
  try {
    // VALIDATE HTTP METHOD
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    // PARSE AND VALIDATE REQUEST BODY WITH ZOD
    const body = await req.json();
    const { success, data, error } = VerifyLinkSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_DATA, details: error.format() },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    const { target, token } = data;
    let verification;

    // VERIFY TOKEN LINK
    switch (target) {
      case "password-reset":
        verification = await getPasswordResetByToken(token);
        break;
      case "email-verification":
        verification = await getVerificationByToken(token);
        break;
      default:
        return NextResponse.json(
          { error: ErrorCode.INVALID_LINK },
          { status: HttpStatus.BAD_REQUEST },
        );
    }

    if (!verification) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_LINK },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK IF LINK HAS EXPIRED
    const hasExpired = new Date(verification.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
        { error: ErrorCode.EXPIRED_LINK },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CONVERTS EXPIRATION TO MILLISECONDS
    const expires = verification.expires.getTime();

    // RETURN THE DATA
    return NextResponse.json(
      {
        message: SuccessCode.VALID_LINK,
        payload: { email: verification.email, expires },
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
