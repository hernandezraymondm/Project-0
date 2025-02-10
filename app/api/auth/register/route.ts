import { generateVerification } from "@/lib/helpers/generate-verification";
import { validateMethod } from "@/lib/utils/validate-method";
import { logActivity } from "../../logs/add-activity/route";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { ActionLog } from "@/lib/enums/action-log.enum";
import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/schema/auth.schema";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  // VALIDATE HTTP METHOD BEFORE PROCESSING
  const methodError = validateMethod(req, "POST");
  if (methodError) return methodError;

  const body = await req.json();

  // VALIDATE REQUEST BODY WITH ZOD
  const { success, data, error } = RegisterSchema.safeParse(body);
  if (!success) {
    return NextResponse.json(
      { message: ErrorCode.INVALID_DATA, details: error.format() },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  const { name, email, password } = data;

  // CHECK IF THE USER ALREADY EXISTS
  const userStore = await db.user.findUnique({ where: { email } });
  if (userStore) {
    return NextResponse.json(
      { message: ErrorCode.AUTH_EMAIL_ALREADY_EXISTS },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  // HASH PASSWORD AND CREATE USER
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  // LOG USER REGISTRATION
  logActivity(user.id, ActionLog.ACCOUNT_SIGNUP);

  // GENERATE AND SEND VERIFICATION EMAIL
  const verification = await generateVerification(email);
  await sendVerificationEmail(
    verification.email,
    verification.token,
    verification.code,
  );

  return NextResponse.json(
    { message: SuccessCode.AUTH_SIGNUP },
    { status: HttpStatus.CREATED },
  );
}
