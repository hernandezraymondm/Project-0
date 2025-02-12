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
      where: { userId: decoded.userId },
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

    // FRONT END CODE
    // const formattedAuditTrails = auditTrails.map((auditTrail) => ({
    //   ...auditTrail,
    //   email: auditTrail.user.email,
    // }));

    // res.json(formattedAuditTrails);

    const totalActivities = await db.auditTrail.count({
      where: { userId: decoded.userId },
    });

    const totalPages = Math.ceil(totalActivities / limit);

    return NextResponse.json({ auditTrails, totalPages });
  } catch (error) {
    console.error("ERROR FETCHING ACTIVITY LOGS:", error);
    return NextResponse.json({ error: "AN ERROR OCCURRED" }, { status: 500 });
  }
}
