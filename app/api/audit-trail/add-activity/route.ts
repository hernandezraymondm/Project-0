import { db } from "@/lib/utils/prisma";

export async function logActivity(action: string, userId: string) {
  try {
    await db.auditTrail.create({
      data: {
        userId,
        action,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("ERROR LOGGING ACTIVITY:", error);
  }
}
