import { generateUUID, generateOTP, generateExpirationDate } from "@/lib/utils";
import { Verification } from "@prisma/client";
import { db } from "@/lib/utils/prisma";

/**
 * CREATE OR UPDATE A NEW VERIFICATION CODE.
 */
export const generateVerification = async (
  userId: string,
  email: string,
  token?: string,
): Promise<Verification> => {
  const newToken = token || generateUUID();
  const code = generateOTP();
  const expires = generateExpirationDate(24); // 24 hours

  const verification = await db.verification.upsert({
    where: { token: newToken },
    update: { code, expires },
    create: { userId, email, token: newToken, code, expires },
  });

  return verification;
};
