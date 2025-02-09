import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function encrypt(payload: any, expires: string) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) {
    console.log("No session found");
    return;
  }

  // Decode the existing token
  const parsed = await decrypt(session);

  // Update the expiration time (e.g., 10 minutes from now)
  const newExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  parsed.expires = newExpires;

  // Re-encrypt the token with the new expiration time
  const newToken = await encrypt(parsed, "15m");

  // Create a response and set the updated token in the cookies
  const response = NextResponse.next();
  response.cookies.set({
    name: "session",
    value: newToken,
    httpOnly: true,
    expires: newExpires,
    path: "/", // Ensure the cookie is sent with all requests
  });

  console.log("Session token refreshed for dashboard");
  return response;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
