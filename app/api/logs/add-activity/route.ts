import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function logActivity(
  action: string,
  userId: string,
  email?: string,
) {
  try {
    await prisma.log.create({
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
