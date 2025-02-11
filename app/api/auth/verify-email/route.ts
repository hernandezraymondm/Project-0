import { getVerificationByTokenAndCode } from "@/data/verification";
import { logActivity } from "../../audit-trail/add-activity/route";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { VerifyEmailSchema } from "@/schema/auth.schema";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { HttpStatus } from "@/config/http.config";
import { getUserByEmail } from "@/data/user";
import { NextResponse } from "next/server";
import { db } from "@/lib/utils/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, code } = VerifyEmailSchema.parse(body);

    // VERIFY TOKEN LINK
    const verification = await getVerificationByTokenAndCode(token, code);
    if (!verification) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_CODE },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK IF LINK HAS EXPIRED
    const hasExpired = new Date(verification.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
        { error: ErrorCode.EXPIRED_CODE },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK IF USER EXISTS
    const user = await getUserByEmail(verification.email);
    if (!user) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_USER_NOT_FOUND },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }

    // CHECK IF EMAIL IS ALREADY VERIFIED
    if (user.emailVerified) {
      await deleteVerificationTokens(verification.email);
      return NextResponse.json(
        { error: ErrorCode.EMAIL_ALREADY_VERIFIED },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // UPDATE USER EMAIL TO VERIFIED
    const verified = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: verification.email,
      },
    });

    // DELETE ALL VERIFICATION TOKENS AFTER SUCCESSFUL VERIFICATION
    if (verified) {
      await deleteVerificationTokens(verification.email);
    }

    // LOG ACTIVITY
    await logActivity(
      ActionLog.ACCOUNT_LOGOUT,
      verification.id,
      verification.email,
    );

    return NextResponse.json(
      { message: SuccessCode.VERIFICATION_SUCCESS },
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

// REUSABLE FUNCTION TO DELETE VERIFICATION TOKENS
async function deleteVerificationTokens(email: string) {
  try {
    await db.verification.deleteMany({
      where: { email },
    });
    console.log(`DELETED ALL VERIFICATION TOKENS FOR ${email}.`);
  } catch (error) {
    console.error(`FAILED TO DELETE VERIFICATION TOKENS FOR ${email}:`, error);
  }
}
