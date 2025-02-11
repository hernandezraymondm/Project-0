import { verifyRefreshToken, generateAccessToken } from "@/lib/utils/auth";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { HttpStatus } from "@/config/http.config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // CHECK IF REFRESH TOKEN EXIST FROM COOKIE
    if (!refreshToken) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_TOKEN_NOT_FOUND },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }
    // VERIFY REFRESH TOKEN
    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      return NextResponse.json(
        { error: ErrorCode.AUTH_TOKEN_INVALID },
        { status: HttpStatus.UNAUTHORIZED },
      );
    }
    // RETURN NEW ACCESS TOKEN
    const accessToken = await generateAccessToken(user.id);
    return NextResponse.json({ accessToken });
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
