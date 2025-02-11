import { getPasswordResetByToken } from "@/data/password-reset";
import { getVerificationByToken } from "@/data/verification";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { TokenSchema } from "@/schema/auth.schema";
import { HttpStatus } from "@/config/http.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, target } = TokenSchema.parse(body);
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
    const data = {
      email: verification.email,
      expires,
    };
    return NextResponse.json(
      { message: SuccessCode.VALID_LINK, data },
      { status: HttpStatus.OK },
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      {
        error: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "An internal server error occurred.",
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
