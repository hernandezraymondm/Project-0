import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json(
      { valid: false, message: "No token" },
      { status: 401 }
    );
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return NextResponse.json({ valid: true, payload }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === "JWTExpired") {
      return NextResponse.json(
        { valid: false, reason: "expired" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { valid: false, reason: "invalid" },
      { status: 401 }
    );
  }
}
