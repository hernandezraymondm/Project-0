"use client";

import { verifyEmail as verifyEmailService } from "@/services/auth.service";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EmailVerificationFormProps {
  token: string;
}

export function EmailVerificationForm({ token }: EmailVerificationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVerified, setIsVerified] = useState(false);
  const code = "123456";

  useEffect(() => {
    const verifyEmail = async () => {
      startTransition(async () => {
        try {
          const response = await verifyEmailService(token, code);
          const data = await response.json();
          if (response.ok) {
            setIsVerified(true);
            toast.success("Your email has been successfully verified.");
          } else {
            toast.error(
              data.error || "An error occurred during email verification.",
            );
          }
        } catch {
          toast.error("An error occurred during email verification.");
        }
      });
    };

    verifyEmail();
  }, [token]);

  if (isPending) {
    return <Loader size="lg" />;
  }

  return (
    <div className="text-center">
      {isVerified ? (
        <>
          <p className="mb-4 text-white">
            Your email has been successfully verified.
          </p>
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
          >
            Go to Login
          </Button>
        </>
      ) : (
        <>
          <p className="mb-4 text-white">
            Email verification failed. Please try again or contact support.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-700"
          >
            Go to Home
          </Button>
        </>
      )}
    </div>
  );
}
