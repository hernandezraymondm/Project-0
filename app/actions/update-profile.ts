"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(200).optional(),
});

export type UpdateProfileResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function updateProfile(
  prevState: unknown,
  formData: FormData
): Promise<UpdateProfileResult> {
  const userId = "1"; // In a real app, you'd get this from the session

  try {
    const { name, bio } = updateProfileSchema.parse({
      name: formData.get("name"),
      bio: formData.get("bio"),
    });

    await prisma.user.update({
      where: { id: userId },
      data: { name, bio },
    });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: "An error occurred while updating your profile",
    };
  }
}
