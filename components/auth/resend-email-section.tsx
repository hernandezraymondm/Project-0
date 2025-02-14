"use client";

import { resendEmail as resendEmailService } from "@/services/auth.service";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { SuccessCode } from "@/lib/enums/success-code.enum";
import { useResendEmail } from "@/hooks/use-resend-email";
import RiseLoader from "react-spinners/RiseLoader";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { Config } from "@/config/app.config";

interface ResendEmailSectionProps {
  email: string;
  setError: Dispatch<SetStateAction<string | undefined>>;
}

const ResendEmailSection = ({ email, setError }: ResendEmailSectionProps) => {
  const { onCooldown, timeLeft, startResendCooldown } = useResendEmail({
    prefixKey: "resendCodeEndTime",
    email,
  });
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Handle resend email with CAPTCHA verification
  const handleResendEmail = async (captchaToken: string) => {
    setError(undefined);

    startTransition(async () => {
      try {
        const response = await resendEmailService(email, captchaToken);
        const data = await response.json();

        if (response.ok && data.message === SuccessCode.EMAIL_SENT) {
          setShowCaptcha(false);
          startResendCooldown(data.resendCooldown);
        } else {
          setError(data.error);
        }
      } catch {
        setError("An error occurred during resending. Please try again.");
      }
    });
  };

  if (showCaptcha) {
    return (
      <div className="w-full flex mt-6 justify-center">
        <ReCAPTCHA
          sitekey={Config.RECAPTCHA_SITE_KEY}
          onChange={(token) => token && handleResendEmail(token)}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex mt-6 text-sm justify-center gap-4 items-center">
      <p className="text-gray-400">Didn&apos;t receive the email?</p>

      {isPending ? (
        <RiseLoader color="hsl(var(--tertiary))" size={6} />
      ) : onCooldown ? (
        <p className="text-gray-400">{timeLeft}s</p>
      ) : (
        <Button
          disabled={onCooldown}
          variant="link"
          size="min"
          className="text-md !font-semibold"
          onClick={() => setShowCaptcha(true)}
        >
          Resend code
        </Button>
      )}
    </div>
  );
};

export default ResendEmailSection;
