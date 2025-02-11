import { verifyRefreshToken, generateAccessToken } from "@/lib/utils/auth";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { HttpStatus } from "@/config/http.config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: ErrorCode.AUTH_TOKEN_NOT_FOUND },
      { status: HttpStatus.UNAUTHORIZED },
    );
  }

  const user = await verifyRefreshToken(refreshToken);

  if (!user) {
    return NextResponse.json(
      { error: ErrorCode.AUTH_TOKEN_INVALID },
      { status: HttpStatus.UNAUTHORIZED },
    );
  }

  const accessToken = await generateAccessToken(user.id);

  return NextResponse.json({ accessToken });
}
