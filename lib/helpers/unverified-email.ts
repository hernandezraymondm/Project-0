import { generateVerification } from "./generate-verification";
import { getVerificationByEmail } from "@/data/verification";
import { sendVerificationEmail } from "../utils/mailer";

// HANDLE UNVERIFIED EMAILS
export const handleUnverifiedEmail = async (userId: string, email: string) => {
  const verification = await getVerificationByEmail(email);

  // CHECK IF RECORD EXIST OR EXPIRED
  if (!verification || new Date(verification.expires) < new Date()) {
    // GENERATE VERIFICATION
    const newVerification = await generateVerification(userId, email);

    // SEND VERIFICATION EMAIL
    await sendVerificationEmail(
      newVerification.email,
      newVerification.token,
      newVerification.code,
    );
    return newVerification;
  }

  return verification;
};
