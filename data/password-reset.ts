import { PasswordReset } from "@prisma/client";
import { db } from "@/lib/utils/prisma";

/**
 * @One
 * Will probably be unused
 * Retrieves a password reset by email
 */
export const getPasswordResetByEmail = async (
  email: string,
): Promise<PasswordReset | null> => {
  try {
    const passwordReset = await db.passwordReset.findFirst({
      where: { email },
      orderBy: { updatedAt: "desc" },
    });

    return passwordReset;
  } catch {
    return null;
  }
};

/**
 * @One
 * Retrieves a password reset by its token value.
 */
export const getPasswordResetByToken = async (
  token: string,
): Promise<PasswordReset | null> => {
  try {
    const passwordReset = await db.passwordReset.findUnique({
      where: { token },
    });

    return passwordReset;
  } catch {
    return null;
  }
};

/**
 * @One
 * Retrieves a password reset by token and code.
 */
export const getPasswordResetByTokenAndCode = async (
  token: string,
  code: string,
): Promise<PasswordReset | null> => {
  try {
    const passwordReset = await db.passwordReset.findFirst({
      where: { token, code },
    });

    return passwordReset;
  } catch {
    return null;
  }
};

// TODO: Check if there are unused
