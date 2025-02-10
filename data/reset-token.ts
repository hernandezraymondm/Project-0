import { PasswordReset } from "@prisma/client";
import { db } from "@/lib/utils/prisma";

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
 * @Many
 * Retrieves all password reset for a given email.
 */
export const getAllPasswordResetsByEmail = async (
  email: string,
): Promise<PasswordReset[]> => {
  try {
    const passwordResets = await db.passwordReset.findMany({
      where: { email },
    });
    return passwordResets;
  } catch (error) {
    console.error(error);
    return [];
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

/**
 * @One
 * Retrieves a password reset token by token and email.
 */
export const getPasswordResetByTokenAndEmail = async (
  token: string,
  email: string,
): Promise<PasswordReset | null> => {
  try {
    const passwordReset = await db.passwordReset.findUnique({
      where: { email, token },
    });

    return passwordReset;
  } catch {
    return null;
  }
};

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
    });

    return passwordReset;
  } catch {
    return null;
  }
};
