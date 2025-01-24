"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getLatestBlogPosts(count = 5) {
  const posts = await prisma.post.findMany({
    take: count,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));
}
