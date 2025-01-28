import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { logActivity } from "@/app/api/logs/add-activity/route";

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  if (!token) {
    throw new Error("Token is missing");
  }
  const decoded = verify(token, process.env.JWT_SECRET!) as {
    userId: string;
  };

  logActivity(decoded.userId, "Logged out");

  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
