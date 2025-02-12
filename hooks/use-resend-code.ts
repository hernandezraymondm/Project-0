"use client";

import { resendCode } from "@/services/auth.service";
import { useState } from "react";

export const useResendCode = (email: string) => {
  const [isSending, setIsSending] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [resendCount, setResendCount] = useState(5);
  const [error, setError] = useState<string | undefined>();

  const handleResendCode = async (captchaToken: string) => {
    setIsSending(true);
    setError("");
    await resendCode(email, captchaToken)
      .then((data) => {
        setResendEnabled(false);
        setShowCaptcha(false);
        setError(data.error);
        setResendCount((prev) => prev + 120);
      })
      .catch(() => {
        setError("An error occurred during resending. Please try again.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleCaptchaSuccess = (captchaToken: string | null) => {
    if (captchaToken) {
      handleResendCode(captchaToken);
    }
  };

  const handleResendComplete = () => {
    setResendEnabled(true);
  };

  return {
    error,
    showCaptcha,
    setShowCaptcha,
    isSending,
    resendEnabled,
    resendCount,
    handleCaptchaSuccess,
    handleResendComplete,
  };
};
