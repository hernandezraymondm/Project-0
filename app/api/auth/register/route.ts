import { generateVerificationToken } from "@/lib/utils/token";
import { validateMethod } from "@/lib/utils/validate-method";
import { logActivity } from "../../logs/add-activity/route";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { ActionLog } from "@/lib/enums/action-log.enum";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/config/http.config";
import { RegisterSchema } from "@/schema";
import { db } from "@/lib/utils/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  // VALIDATE HTTP METHOD BEFORE PROCESSING
  const methodError = validateMethod(req, "POST");
  if (methodError) return methodError;

  const body = await req.json();

  // VALIDATE REQUEST BODY WITH ZOD
  const validation = RegisterSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: ErrorCode.INVALID_DATA, details: validation.error.format() },
      { status: HttpStatus.BAD_REQUEST },
    );
  }

  const { name, email, password } = validation.data;

  // CHECK IF THE USER ALREADY EXISTS
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
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
  logActivity(user.id, ActionLog.ACCOUNT_SIGNUP);

  // GENERATE AND SEND VERIFICATION EMAIL
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
    verificationToken.code,
  );

  return NextResponse.json(
    { message: SuccessCode.ACCOUNT_SIGNUP },
    { status: HttpStatus.CREATED },
  );
}
