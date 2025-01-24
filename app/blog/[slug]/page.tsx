import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import type { Metadata } from "next";
import { BlogPost } from "@/components/blog-post";
import { Comments } from "@/components/comments";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const prisma = new PrismaClient();

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: "article",
      authors: [post.author.name],
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogPost post={post} />
      <Suspense fallback={<LoadingSpinner />}>
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
}
