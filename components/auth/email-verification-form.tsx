"use client";

import {
  verifyLink as verifyLinkService,
  verifyEmail as verifyEmailService,
} from "@/services/auth.service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { useEffect, useState, useTransition } from "react";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormAlert } from "../reusable/form-alert";
import { Countdown } from "../reusable/countdown";
import { OtpSchema } from "@/schema/auth.schema";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type * as z from "zod";

interface EmailVerificationFormProps {
  token: string;
}

export function EmailVerificationForm({ token }: EmailVerificationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isValidLink, setIsValidLink] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [expires, setExpires] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const form = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const verifyLink = async () => {
      const response = await verifyLinkService("email-verification", token);
      const data = await response.json();
      try {
        if (response.ok && data.message === SuccessCode.VALID_LINK) {
          setIsValidLink(true);
          setEmail(data.payload.email);
          setExpires(data.payload.expires);
        } else {
          setError(data.error);
        }
      } catch {
        toast.error("An error occurred during email verification.");
      }
    };
    if (token) {
      verifyLink();
    } else {
      setError("No verification token provided");
    }
  }, [token]);

  const onSubmit = (values: z.infer<typeof OtpSchema>) => {
    setError("");
    startTransition(async () => {
      const response = await verifyEmailService(token, values.code);
      const data = await response.json();
      console.log(data);
      try {
        if (response.ok && data.message === SuccessCode.VERIFICATION_SUCCESS) {
          setIsVerified(true);
          const message = data.message.toLowerCase();
          const formattedMessage =
            message.charAt(0).toUpperCase() + message.slice(1);
          toast.success(formattedMessage);
        } else if (response.status === 401) {
          router.push("/auth/unauthorized");
        } else {
          setError(data.error);
          toast.error(data.error || "Verification failed. Please try again");
        }
      } catch {
        toast.error(
          "An error occurred during email verification. Please try again.",
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
        <Loader size="lg" className="text-purple-600" />
        <p className="text-center text-gray-600 dark:text-gray-300">
          Please wait while we process your request...
        </p>
      </motion.div>
    );
  }

  // ERROR STATE
  if (
    error &&
    error !== ErrorCode.INVALID_CODE &&
    error !== ErrorCode.EXPIRED_CODE
  ) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <p className="text-gray-800 dark:text-white">
          Email verification failed. Please try again or contact support.
        </p>
        <FormAlert message={error} />
        <Button
          onClick={() => router.push("/")}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white transition-all duration-300 hover:from-purple-700 hover:to-indigo-700"
        >
          Go to Home
        </Button>
      </motion.div>
    );
  }

  // SUCCESS STATE
  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <p className="text-lg text-gray-800 dark:text-white">
          Your email has been successfully verified.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Thank you for your support. We are pleased to inform you that your
          account is now ready for use.
        </p>
        <Button
          onClick={() => router.push("/auth/login")}
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
              Enter the 6-digit code we sent to <strong>{email}</strong> to
              continue.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This code will expire in{" "}
              <strong>
                <Countdown expiration={expires} />
              </strong>
              .
            </p>
          </div>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP {...field} maxLength={6} disabled={isPending}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormAlert message={error} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-indigo-700"
          >
            Verify Email
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
