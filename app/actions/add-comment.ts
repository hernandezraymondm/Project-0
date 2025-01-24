"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(500),
});

export async function addComment(prevState: unknown, formData: FormData) {
  const sessionToken = (await cookies()).get("session")?.value;

  if (!sessionToken) {
    return { error: "You must be logged in to add a comment" };
  }

  try {
    const decoded = verify(sessionToken, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { postId, content } = commentSchema.parse({
      postId: formData.get("postId"),
      content: formData.get("content"),
    });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: { author: true },
    });

    return { success: true, comment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: "An error occurred while adding the comment" };
  }
}
