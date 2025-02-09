import { generateUUID, generateOTP, generateExpirationDate } from "@/lib/utils";
import { getVerificationTokensByEmail } from "@/data/verification-token";
import { VerificationToken } from "@prisma/client";
import { db } from "@/lib/utils/prisma";

/**
 * Generates a new verification token for a given email.
 * If an existing token is found for the email, it will be deleted and replaced with a new token.
 */
export const generateVerificationToken = async (
  email: string,
): Promise<VerificationToken> => {
  const token = generateUUID();
  const code = generateOTP(); // Generate a 6-digit code
  const expires = generateExpirationDate(24); // 1 day

  const verificationStore = await getVerificationTokensByEmail(email);

  // Delete existing tokens
  if (verificationStore.length > 0) {
    try {
      await db.verificationToken.deleteMany({ where: { email } });
      console.log(`Deleted all verification tokens for ${email}.`);
    } catch (error) {
      console.error(
        `Failed to delete verification tokens for ${email}:`,
        error,
      );
    }
  }
  // Create a new token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      code,
      expires,
    },
  });
  return verificationToken;
};
