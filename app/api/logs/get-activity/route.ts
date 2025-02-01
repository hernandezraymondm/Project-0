import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "4");
  const offset = (page - 1) * limit;

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const activities = await prisma.log.findMany({
      where: { userId: decoded.userId },
      orderBy: { timestamp: "desc" },
      skip: offset,
      take: limit,
    });

    const totalActivities = await prisma.log.count({
      where: { userId: decoded.userId },
    });

    const totalPages = Math.ceil(totalActivities / limit);

    return NextResponse.json({ activities, totalPages });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
