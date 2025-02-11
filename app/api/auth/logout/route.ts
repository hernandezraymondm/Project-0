import { logActivity } from "../../audit-trail/add-activity/route";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { NextRequest, NextResponse } from "next/server";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { verifyRefreshToken } from "@/lib/utils/auth";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // GET REFRESH TOKEN FROM COOKIE
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_TOKEN_NOT_FOUND },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }

    // VERIFY REFRESH TOKEN
    const user = await verifyRefreshToken(refreshToken);

    // DELETE THE SESSION
    if (user) {
      const userAgent = req.headers.get("user-agent") || "Unknown Device";
      await db.session.deleteMany({
        where: {
          userId: user.id,
          userAgent: userAgent,
        },
      });

      // LOG ACTIVITY
      logActivity(ActionLog.ACCOUNT_LOGOUT, user.id, user.email);
    }

    const response = NextResponse.json(
      { message: SuccessCode.AUTH_LOGOUT },
      { status: HttpStatus.OK },
    );

    // REMOVE THE COOKIE
    response.cookies.set("refreshToken", "", { maxAge: 0 });

    return response;
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
