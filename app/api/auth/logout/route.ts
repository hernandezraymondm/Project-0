import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/utils/auth";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_TOKEN_NOT_FOUND },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }
    const user = await verifyRefreshToken(refreshToken);

    if (user?.id) {
      const userAgent = req.headers.get("user-agent") || "Unknown Device";
      await db.session.deleteMany({
        where: {
          userId: user.id,
          userAgent: userAgent,
        },
      });
    }

    const response = NextResponse.json(
      { message: SuccessCode.AUTH_LOGOUT },
      { status: HttpStatus.OK },
    );
    response.cookies.set("refreshToken", "", { maxAge: 0 });

    return response;
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
