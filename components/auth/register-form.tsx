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
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schema/auth.schema";
import { FormAlert } from "@/components/form-alert";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const RegisterForm = () => {
  const { register } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const response = await register(
          values.name,
          values.email,
          values.password,
          values.confirmPassword,
        );
        if (response.message === SuccessCode.AUTH_SIGNUP) {
          setSuccess(response.message);
        } else if (response.error) {
          setError(response.error || "An error occurred during registration.");
        }
      } catch {
        toast.error("An error occurred during registration. Please try again.");
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* NAME FIELD */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isPending}
                    type="text"
                    placeholder="Enter your name"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <div className="absolute right-0 top-0 flex h-full items-center px-3 py-2 hover:bg-transparent">
                    <IdCard className="h-4 w-4 text-gray-600" strokeWidth="3" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <div className="absolute right-0 top-0 flex h-full items-center px-3 py-2 hover:bg-transparent">
                    <IdCard className="h-4 w-4 text-gray-600" strokeWidth="3" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        {/* CONFIRM PASSWORD FIELD */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isPending}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...field}
                    className="border-gray-700 bg-gray-800 pr-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  <Button
                    disabled={isPending}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}
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
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FORM ALERT */}

        <FormAlert message={error} />
        <FormAlert message={success} variant="success" />

        {/* REGISTER BUTTON */}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
        >
          {isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};
