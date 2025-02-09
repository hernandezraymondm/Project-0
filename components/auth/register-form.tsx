"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon, IdCard } from "lucide-react";
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
import { toast } from "sonner";

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        toast.info("Please check your email to verify your account.");
        router.push("/login");
      } else {
        toast.error(data.message || "An error occurred during registration.");
      }
    } catch {
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <div className="absolute right-0 top-0 flex h-full items-center px-3 py-2 hover:bg-transparent">
                    <IdCard className="h-4 w-4 text-gray-600" strokeWidth="3" />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon
                        className="h-4 w-4 text-gray-600"
                        strokeWidth="3"
                      />
                    ) : (
                      <EyeIcon
                        className="h-4 w-4 text-gray-500"
                        strokeWidth="3"
                      />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon
                        className="h-4 w-4 text-gray-600"
                        strokeWidth="3"
                      />
                    ) : (
                      <EyeIcon
                        className="h-4 w-4 text-gray-500"
                        strokeWidth="3"
                      />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Register Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
