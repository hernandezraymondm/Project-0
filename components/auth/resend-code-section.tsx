"use client";

import { ResendCodeCountdown } from "@/components/reusable/countdown";
import { useResendCode } from "@/hooks/use-resend-code";
import RiseLoader from "react-spinners/RiseLoader";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { Config } from "@/config/app.config";
import { useEffect } from "react";

interface ResendCodeSectionProps {
  email: string;
  setError: (error: string | undefined) => void;
}

export const ResendCodeSection = ({
  email,
  setError,
}: ResendCodeSectionProps) => {
  const {
    error,
    showCaptcha,
    setShowCaptcha,
    isSending,
    resendEnabled,
    resendCount,
    handleCaptchaSuccess,
    handleResendComplete,
  } = useResendCode(email);

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  return (
    <div className="w-full flex mt-6 text-sm justify-center">
      {showCaptcha && (
        <div className="flex justify-center items-center">
          <ReCAPTCHA
            sitekey={Config.RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaSuccess}
          />
        </div>
      )}

      {!isSending && resendEnabled && !showCaptcha && (
        <div className="flex gap-4 justify-center items-center">
          <p className="text-center text-gray-400">
            Didn&apos;t receive the email?{" "}
          </p>
          <Button
            variant="link"
            size="min"
            className="text-md !font-semibold"
            onClick={() => setShowCaptcha(true)}
            disabled={isSending || !resendEnabled}
          >
            Resend code
          </Button>
        </div>
      )}

      {isSending && !showCaptcha && (
        <div className="flex gap-4 justify-center items-center">
          <p className="text-center text-gray-400">
            Didn&apos;t receive the email?{" "}
          </p>
          <RiseLoader
            color="hsl(var(--tertiary))"
            size={6}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {!resendEnabled && !showCaptcha && (
        <div className="flex gap-4 justify-center items-center">
          <p className="text-center text-gray-400">
            Didn&apos;t receive the email?{" "}
          </p>
          <ResendCodeCountdown
            initialCount={resendCount}
            onComplete={handleResendComplete}
          />
        </div>
      )}
    </div>
  );
};
