import { getVerificationByEmail } from "@/data/verification";
import { generateVerification } from "./generate-verification";
import { sendVerificationEmail } from "../utils/mailer";

// HANDLE UNVERIFIED EMAILS
export const handleUnverifiedEmail = async (email: string) => {
  const verification = await getVerificationByEmail(email);

  if (!verification) {
    // Generate verification token
    const newVerification = await generateVerification(email);

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
