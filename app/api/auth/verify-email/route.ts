import { getVerificationByTokenAndCode } from "@/data/verification";
import { logActivity } from "../../audit-trail/add-activity/route";
import { validateMethod } from "@/lib/utils/validate-method";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { VerifyEmailSchema } from "@/schema/auth.schema";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { HttpStatus } from "@/config/http.config";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    // VALIDATE HTTP METHOD
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    // PARSE AND VALIDATE REQUEST BODY
    const body = await req.json();
    const { success, data, error } = VerifyEmailSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_DATA, details: error.format() },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    const { token, code } = data;
    // VERIFY TOKEN CODE
    const verification = await getVerificationByTokenAndCode(token, code);
    if (!verification) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_CODE },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK IF LINK HAS EXPIRED
    const isExpired = new Date(verification.expires) < new Date();
    if (isExpired) {
      return NextResponse.json(
        { error: ErrorCode.EXPIRED_CODE },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // CHECK IF USER EXISTS
    const user = await getUserByEmail(verification.email);
    if (!user) {
      await deleteVerificationTokens(verification.email);
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
    logActivity(ActionLog.VERIFIED_EMAIL, user.id);

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
