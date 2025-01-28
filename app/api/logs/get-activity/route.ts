import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// Get user's activity logs
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
    const userId = decoded.userId;

    const activities = await prisma.log.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
