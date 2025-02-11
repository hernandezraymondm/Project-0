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
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_USER_NOT_FOUND },
        { status: HttpStatus.NOT_FOUND },
      );
    }

    // RETURN USER INFO
    return NextResponse.json(user);

    // if (typeof payload.userId !== "string") {
    //   return NextResponse.json(
    //     { message: "Invalid token payload" },
    //     { status: 401 },
    //   );
    // }

    // const log = await db.auditTrail.findFirst({
    //   where: {
    //     userId: user.id,
    //     action: "Logged in",
    //   },
    //   orderBy: {
    //     timestamp: "desc",
    //   },
    // });

    // return NextResponse.json({
    //   user: { ...user, lastLogin: log?.timestamp },
    // });
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
