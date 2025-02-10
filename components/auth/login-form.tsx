"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOffIcon, IdCard } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/services/auth.service";
import { LoginSchema } from "@/schema/auth.schema";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormAlert } from "../form-alert";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [lockTime, setLockTime] = useState<number | undefined>();
  const [verificationToken, setVerificationToken] = useState<
    string | undefined
  >("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(async () => {
      try {
        const response = await loginUser(values);
        const data = await response.json();
        if (response.ok) {
          handleResponse(data, setTwoFactor);
        } else {
          handleErrorResponse(data, setVerificationToken, setError);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred during login.");
      }
    });
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  const handleResponse = (
    data: any,
    setTwoFactor: (state: boolean) => void,
  ) => {
    if (data.twoFactor) {
      setTwoFactor(true);
      toast.info("Please enter your 2FA code to complete login.");
    } else if (data.message === "Login successful") {
      toast.success("You have been logged in successfully.");
      navigateToDashboard();
    }
  };

  const handleErrorResponse = (
    data: any,
    setVerificationToken: (token: string) => void,
    setError: (error: string) => void,
  ) => {
    if (data.lockTime) {
      setLockTime(data.lockTime);
      toast.warning(
        `Your account has been lock due to multiple failed attempts. Please try again in ${lockTime} seconds.`,
      );
    }
    if (data.verificationToken) {
      setVerificationToken(data.verificationToken);
      toast.info("Please verify your email address to login.");
    }
    setError(data.message || "An error occurred during login.");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* EMAIL FIELD */}
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

        {/* PASSWORD FIELD */}
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
                    disabled={isPending}
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

        {/* 2FA FIELD (CONDITIONAL) */}
        {twoFactor && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">2FA Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your 2FA code"
                    {...field}
                    className="border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        )}

        {/* FORM ALERT */}
        <FormAlert message={error} />

        {/* LOGIN BUTTON */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* RESET PASSWORD LINK */}
      <div className="mt-6 text-center">
        <Link
          href="/reset-password"
          className="text-purple-400 underline transition-all duration-300 hover:text-pink-500"
        >
          Reset Password
        </Link>
      </div>
    </Form>
  );
}
