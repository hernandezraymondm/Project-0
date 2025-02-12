import { createHash, randomBytes } from "crypto";
import type { NextRequest } from "next/server";
import { Config } from "@/config/app.config";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";

export async function generateAccessToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Config.ACCESS_TOKEN_EXPIRY)
    .setJti(randomBytes(16).toString("hex"))
    .sign(new TextEncoder().encode(Config.ACCESS_TOKEN_SECRET));
}

export async function generateRefreshToken(req: NextRequest, userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Config.REFRESH_TOKEN_EXPIRY)
    .setJti(randomBytes(16).toString("hex"))
    .sign(new TextEncoder().encode(Config.REFRESH_TOKEN_SECRET));

  const hashedToken = createHash("sha256").update(token).digest("hex");

  const userAgent = req.headers.get("user-agent") || "Unknown Device";
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("remote-addr") ||
    "Unknown IP";

  await db.session.create({
    data: {
      userId,
      refreshToken: hashedToken,
      userAgent,
      ipAddress,
      expiresAt: Config.REFRESH_DB_SESSION_EXPIRY,
    },
  });

  return token;
}

export async function verifyAccessToken(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(Config.ACCESS_TOKEN_SECRET),
    );
    return verified.payload as { userId: string };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(Config.REFRESH_TOKEN_SECRET),
    );
    if (!verified) {
      return null;
    }

    const hashedToken = createHash("sha256").update(token).digest("hex");
    const session = await db.session.findUnique({
      where: { refreshToken: hashedToken },
      include: { user: true },
    });

    if (!session || new Date() > session.expiresAt) {
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(req: NextRequest) {
  const accessToken = req.headers.get("Authorization")?.split(" ")[1];
  if (accessToken) {
    const user = await verifyAccessToken(accessToken);
    if (user) return user;
  }
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (refreshToken) {
    const user = await verifyRefreshToken(refreshToken);
    if (user) {
      return { userId: user.id };
    }
  }

  return null;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}
