import { NextResponse } from "next/server";
import { db } from "@/lib/utils/prisma";
import { cookies } from "next/headers";

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
    const auditTrails = await db.auditTrail.findMany({
      orderBy: { timestamp: "desc" },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const totalActivities = await db.auditTrail.count();

    const totalPages = Math.ceil(totalActivities / limit);

    return NextResponse.json({ auditTrails, totalPages });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
