// api/user.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    const log = await prisma.log.findFirst({
      where: {
        userId: decoded.userId,
        action: "Logged in",
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: { ...user, lastLogin: log?.timestamp },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
