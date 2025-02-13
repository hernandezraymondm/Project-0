import { generatePasswordReset } from "@/lib/helpers/generate-password-reset";
import { validateMethod } from "@/lib/utils/validate-method";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { sendPasswordResetEmail } from "@/lib/utils/mailer";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/config/http.config";
import { getUserByEmail } from "@/data/user";
import * as z from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    // VALIDATE HTTP METHOD
    const methodError = validateMethod(req, "POST");
    if (methodError) return methodError;

    // PARSE AND VALIDATE REQUEST BODY WITH ZOD
    const body = await req.json();
    const { success, data, error } = resetPasswordSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { error: ErrorCode.INVALID_DATA, details: error.format() },
        { status: HttpStatus.BAD_REQUEST },
      );
    }
    const { email } = data;
    // CHECK IF USER EXISTS
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_USER_NOT_FOUND },
        { status: HttpStatus.BAD_REQUEST },
      );
    }

    // GENERATE AND SEND PASSWORD RESET
    const passwordReset = await generatePasswordReset(user.id, user.email);
    await sendPasswordResetEmail(
      passwordReset.email,
      passwordReset.token,
      passwordReset.code,
    );

    return NextResponse.json(
      { message: SuccessCode.PASSWORD_RESET },
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
