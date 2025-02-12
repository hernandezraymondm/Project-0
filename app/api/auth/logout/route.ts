import { logActivity } from "../../audit-trail/add-activity/route";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { getAuthenticatedUser } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { ActionLog } from "@/lib/enums/audit-log.enum";
import { HttpStatus } from "@/config/http.config";
import { db } from "@/lib/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    // VERIFY REFRESH TOKEN
    const auth = await getAuthenticatedUser(req);
    if (auth) {
      // DELETE THE SESSION
      const userAgent = req.headers.get("user-agent") || "Unknown Device";
      await db.session.deleteMany({
        where: {
          userId: auth.userId,
          userAgent: userAgent,
        },
      });
      // LOG ACTIVITY
      logActivity(ActionLog.ACCOUNT_LOGOUT, auth.userId);
    }

    // REMOVE THE COOKIE
    const response = NextResponse.json(
      { message: SuccessCode.AUTH_LOGOUT },
      { status: HttpStatus.OK },
    );
    response.cookies.set("refreshToken", "", { maxAge: 0 });

    return response;
  } catch (error) {
    console.error("INTERNAL SERVER ERROR:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "An internal server error occurred.",
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
