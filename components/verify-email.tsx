"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VerifyEmailProps {
  token: string;
}

export function VerifyEmail({ token }: VerifyEmailProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (response.ok) {
          setIsVerified(true);
          toast({
            title: "Email verified",
            description: "Your email has been successfully verified.",
          });
        } else {
          toast({
            title: "Verification failed",
            description:
              data.message || "An error occurred during email verification.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Verification failed",
          description: "An error occurred during email verification.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (isLoading) {
    return <div>Verifying your email...</div>;
  }

  return (
    <div className="text-center">
      {isVerified ? (
        <>
          <p className="mb-4">Your email has been successfully verified.</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </>
      ) : (
        <>
          <p className="mb-4">
            Email verification failed. Please try again or contact support.
          </p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </>
      )}
    </div>
  );
}
