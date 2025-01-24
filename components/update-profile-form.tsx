"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  updateProfile,
  type UpdateProfileResult,
} from "@/app/actions/update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const initialState: UpdateProfileResult | null = null;

export function UpdateProfileForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateProfile, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast({
          title: "Success",
          description: state.message,
        });
      } else {
        toast({
          title: "Error",
          description: state.error,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Input type="text" id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <Textarea id="bio" name="bio" rows={3} className="mt-1" />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  );
}
