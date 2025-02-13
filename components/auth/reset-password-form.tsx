"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowRightIcon,
  CheckCircle,
  MailIcon,
  MailQuestion,
} from "lucide-react";
import { resetPassword as resetPasswordService } from "@/services/auth.service";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { ExpirationCountdown } from "../reusable/countdown";
import { ResetPasswordSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import RiseLoader from "react-spinners/RiseLoader";
import { FormAlert } from "../reusable/form-alert";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import * as z from "zod";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean | undefined>(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    startTransition(async () => {
      const response = await resetPasswordService(values.email);
      const data = await response.json();
      try {
        if (response.ok) {
          setEmail(values.email);
          setSuccess(true);
          toast.success("Password reset instruction sent.");
        } else {
          setError(data.error);
        }
      } catch {
        toast.error(
          "An error occurred while sending the reset password email. Please try again.",
        );
      }
    });
  };

  // LOADING STATE
  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <RiseLoader
          color="hsl(var(--tertiary))"
          size={12}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="text-center text-gray-600 dark:text-gray-300">
          Please wait while we process your request...
        </p>
      </motion.div>
    );
  }

  // SUCCESS STATE
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <p className="text-gray-800 dark:text-white">
          An email has been sent to {email}. Check your inbox or spam folder for
          instructions to reset your password.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          This code will expire in{" "}
          <strong>
            <ExpirationCountdown expiration={Date.now() + 60 * 60 * 1000} />
          </strong>
          .
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-indigo-700"
        >
          Go to Login
        </Button>
      </motion.div>
    );
  }

  // DEFAULT FORM STATE
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-800 dark:text-white">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={isPending}
                      placeholder="Enter your email"
                      {...field}
                      className="pl-10 pr-3 py-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 rounded-lg"
                    />
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Form Alert */}
          <FormAlert message={error} />

          {/* Reset Password Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-indigo-700"
          >
            {isPending ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Reset Link
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </motion.div>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
