import VerificationEmail from "@/components/emails/email-verification";
import ResetPasswordEmail from "@/components/emails/reset-password";
import { Config } from "@/config/app.config";
import { Resend } from "resend";

const resend = new Resend(Config.RESEND_KEY);
const appName = Config.APP_NAME;
const supportEmail = Config.EMAIL_SUPPORT;

export const sendVerificationEmail = async (
  email: string,
  token: string,
  code: string,
) => {
  const verificationLink = `${Config.DOMAIN}/auth/email-verification/${token}`;

  // Send verification email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify Your Email",
    react: VerificationEmail({
      verificationLink,
      verificationCode: code,
      appName,
      supportEmail,
    }),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  code: string,
) => {
  const resetLink = `${Config.DOMAIN}/auth/password-reset/${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({
      resetLink,
      resetCode: code,
      supportEmail,
    }),
  });
};

// Lockout email alert
export const sendLockoutEmailAlert = async (email: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your Account Has Been Locked",
    html: `<p>Your account has been locked due to multiple failed login attempts.</p>
    <p> If this is not you, please secure your account.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token} </p>`,
  });
};
