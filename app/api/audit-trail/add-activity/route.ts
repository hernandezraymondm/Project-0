import { db } from "@/lib/utils/prisma";

export async function logActivity(
  action: string,
  userId: string,
  email?: string,
) {
  try {
    await db.auditTrail.create({
      data: {
        userId,
        email,
        action,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
