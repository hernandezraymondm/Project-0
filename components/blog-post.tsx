import type { Post, User } from "@prisma/client";

interface BlogPostProps {
  post: Post & { author: User };
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="prose lg:prose-xl">
      <h1>{post.title}</h1>
      <p className="text-gray-500">
        By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
