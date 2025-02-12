import { validateMethod } from "@/lib/utils/validate-method";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { getAuthenticatedUser } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";

export async function GET(req: NextRequest) {
  try {
    // VALIDATE HTTP METHOD BEFORE PROCESSING
    const methodError = validateMethod(req, "GET");
    if (methodError) return methodError;

    // VALIDATE AUTHORIZATION BEARER TOKEN
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_NOT_FOUND },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }

    // CHECK USER FROM DB
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_USER_NOT_FOUND },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }

    // RETURN USER INFO
    return NextResponse.json({ user });
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
