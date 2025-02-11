"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { EyeIcon, EyeOffIcon, IdCard } from "lucide-react";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema/auth.schema";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { FormAlert } from "../form-alert";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";

export function LoginForm() {
  const { login } = useAuth();
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
        const response = await login(
          values.email,
          values.password,
          values.code,
        );

        if (response.twoFactor) {
          setTwoFactor(true);
          toast.info("Please enter your 2FA code to complete login.");
        } else if (response.error === ErrorCode.AUTH_ACCOUNT_LOCKED) {
          setLockTime(response.lockTime);
          setError(response.error);
          toast.warning(
            `Your account has been locked due to multiple failed attempts. Please try again in ${response.lockTime} seconds.`,
          );
        } else if (response.verificationToken) {
          setError(response.error);
          setVerificationToken(response.verificationToken);
          toast.info("Please verify your email address to login.");
        } else {
          setError(response.error);
        }
      } catch {
        setError("An error occurred during login. Please try again.");
      }
    });
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
                    disabled={isPending}
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
                    disabled={isPending}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <Button
                    disabled={isPending}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
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
                    disabled={isPending}
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
          disabled={isPending}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* RESET PASSWORD LINK */}
      <div className="mt-6 text-center">
        <Link
          href="/auth/reset-password"
          className="text-purple-400 underline transition-all duration-300 hover:text-pink-500"
        >
          Reset Password
        </Link>
      </div>
    </Form>
  );
}
