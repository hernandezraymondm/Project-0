import { generateVerification } from "./generate-verification";
import { getVerificationByEmail } from "@/data/verification";
import { sendVerificationEmail } from "../utils/mailer";

// HANDLE UNVERIFIED EMAILS
export const handleUnverifiedEmail = async (userId: string, email: string) => {
  const verification = await getVerificationByEmail(email);

  // CHECK IF RECORD EXIST OR EXPIRED
  if (!verification || new Date(verification.expires) < new Date()) {
    // Generate verification token
    const newVerification = await generateVerification(userId, email);

    // Send verification email
    await sendVerificationEmail(
      newVerification.email,
      newVerification.token,
      newVerification.code,
    );
    return newVerification;
  }

  return verification;
};
