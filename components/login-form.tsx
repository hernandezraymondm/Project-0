"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  otpToken: z.string().optional(),
});

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      otpToken: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.require2FA) {
          setRequire2FA(true);
          toast({
            title: "2FA Required",
            description: "Please enter your 2FA code to complete login.",
          });
        } else if (data.message === "Login successful") {
          toast({
            title: "Login successful",
            description: "You have been logged in successfully.",
          });
          router.push("/dashboard");
          router.refresh();
        } else {
          toast({
            title: "Login failed",
            description: data.message || "Invalid email or password.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: "An error occurred during login.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {require2FA && (
          <FormField
            control={form.control}
            name="otpToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>2FA Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your 2FA code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <Link href="/reset-password" className="hover:text-blue-500 underline">
        Reset Password
      </Link>
    </Form>
  );
}
