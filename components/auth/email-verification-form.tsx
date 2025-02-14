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
import { useCountdownTimer } from "@/hooks/use-countdown";
import { ErrorCode } from "@/lib/enums/error-code.enum";
import ResendEmailSection from "./resend-email-section";
import { zodResolver } from "@hookform/resolvers/zod";
import RiseLoader from "react-spinners/RiseLoader";
import { FormAlert } from "../reusable/form-alert";
import { OtpSchema } from "@/schema/auth.schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type * as z from "zod";

interface EmailVerificationFormProps {
  token: string;
}

const EmailVerificationForm = ({ token }: EmailVerificationFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const { formattedTime } = useCountdownTimer(expiresAt ?? 0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean | undefined>(false);

  const form = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const verifyLink = async () => {
      try {
        const response = await verifyLinkService("email-verification", token);
        const data = await response.json();

        if (response.ok && data.message === SuccessCode.VALID_LINK) {
          setEmail(data.payload.email);
          setExpiresAt(data.payload.expires);
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
      try {
        const response = await verifyEmailService(token, values.code);
        const data = await response.json();

        if (response.ok && data.message === SuccessCode.VERIFICATION_SUCCESS) {
          setSuccess(true);
          toast.success("Your email has been successfully verified.");
        } else if (response.status === 401) {
          router.push("/unauthorized");
        } else {
          setError(data.error);
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
        <RiseLoader color="hsl(var(--tertiary))" size={12} />
        <p className="text-gray-600 dark:text-gray-300">
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
        <Button onClick={() => router.push("/")} className="w-full">
          Go to Home
        </Button>
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
        <p className="text-lg text-gray-800 dark:text-white">
          Your email has been successfully verified.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your account is now ready for use.
        </p>
        <Button onClick={() => router.push("/login")} className="w-full">
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
            {expiresAt && (
              <p className="text-gray-600 dark:text-gray-300">
                This code will expire in {formattedTime}
              </p>
            )}
          </div>

          {/* OTP Field */}
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

          {/* Form Alert */}
          <FormAlert message={error} />

          {/* Verify button */}
          <Button type="submit" disabled={isPending} className="w-full">
            Verify Email
          </Button>
        </form>
      </Form>
      <ResendEmailSection email={email} setError={setError} />
    </motion.div>
  );
};

export default EmailVerificationForm;
