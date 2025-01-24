"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/app/actions/add-comment";

export function AddCommentForm({ postId }: { postId: string }) {
  const [state, formAction] = useFormState(addComment, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="mt-4">
      <input type="hidden" name="postId" value={postId} />
      <Textarea
        name="content"
        placeholder="Add a comment..."
        className="w-full mb-2"
        required
      />
      <Button type="submit">Add Comment</Button>
      {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
