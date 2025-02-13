import { generateExpirationDate, generateOTP, generateUUID } from "../utils";
import { PasswordReset } from "@prisma/client";
import { db } from "../utils/prisma";

export const generatePasswordReset = async (
  userId: string,
  email: string,
  token?: string,
): Promise<PasswordReset> => {
  const newToken = token || generateUUID();
  const code = generateOTP(); // Generate a 6-digit code
  const expires = generateExpirationDate(1); // 1 hour

  const passwordReset = await db.passwordReset.upsert({
    where: { token: newToken },
    update: { code, expires },
    create: { userId, email, token: newToken, code, expires },
  });

  return passwordReset;
};
