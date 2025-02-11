"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface NewPasswordFormProps {
  token: string;
}

export function NewPasswordForm({ token }: NewPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          "Your password has been reset. You can now log in with your new password.",
        );
        router.push("/auth/login");
      } else {
        toast.error(
          data.message || "An error occurred while resetting your password.",
        );
      }
    } catch {
      toast.error("An error occurred while resetting your password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  {...field}
                  className="border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">
                Confirm New Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  {...field}
                  className="border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
