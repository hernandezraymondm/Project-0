"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { Post } from "@prisma/client";

interface BlogPostFormProps {
  initialData?: Partial<Post>;
}

export function BlogPostForm({ initialData = {} }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState((initialData.title as string) || "");
  const [content, setContent] = useState((initialData.content as string) || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (create or update blog post)
    // ...
    router.push("/dashboard/blog");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <Button type="submit">
        {initialData.id ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}
