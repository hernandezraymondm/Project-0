import { generateVerification } from "@/lib/helpers/generate-verification";
import { logActivity } from "../../audit-trail/add-activity/route";
import { validateMethod } from "@/lib/utils/validate-method";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { RegisterSchema } from "@/schema/auth.schema";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // VALIDATE HTTP METHOD BEFORE PROCESSING
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    const body = await req.json();

    // VALIDATE REQUEST BODY WITH ZOD
    const { success, data, error } = RegisterSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_DATA, details: error.format() },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    const { name, email, password } = data;

    // CHECK IF THE USER ALREADY EXISTS
    const userStore = await db.user.findUnique({ where: { email } });
    if (userStore) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_EMAIL_ALREADY_EXISTS },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // HASH PASSWORD AND CREATE USER
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    // LOG USER REGISTRATION
    logActivity(ActionLog.ACCOUNT_SIGNUP, user.id);

    // CHECK APP SETTINGS
    const settings = await db.setting.findFirst({
      select: { emailVerificationEnabled: true },
    });
    if (settings?.emailVerificationEnabled) {
      // GENERATE AND SEND VERIFICATION EMAIL
      const verification = await generateVerification(user.id, user.email);
      await sendVerificationEmail(
        verification.email,
        verification.token,
        verification.code,
      );
    }

    return NextResponse.json(
      { message: SuccessCode.AUTH_SIGNUP },
      { status: HttpStatus.CREATED },
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
