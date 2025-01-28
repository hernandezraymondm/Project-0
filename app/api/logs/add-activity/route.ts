import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function logActivity(userId: string, action: string) {
  try {
    await prisma.log.create({
      data: {
        userId,
        action,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
