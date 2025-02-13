import { Verification } from "@prisma/client";
import { db } from "@/lib/utils/prisma";

/**
 * @One
 * Retrieves a verification by a given email.
 */
export const getVerificationByEmail = async (
  email: string,
): Promise<Verification | null> => {
  try {
    const verification = await db.verification.findFirst({
      where: { email },
      orderBy: { updatedAt: "desc" },
    });

    return verification;
  } catch {
    return null;
  }
};

/**
 * @One
 * Retrieves a verification by its token value.
 */
export const getVerificationByToken = async (
  token: string,
): Promise<Verification | null> => {
  try {
    const verification = await db.verification.findUnique({
      where: { token },
    });

    return verification;
  } catch {
    return null;
  }
};

/**
 * @One
 * Retrieves a verification by token and code.
 */
export const getVerificationByTokenAndCode = async (
  token: string,
  code: string,
): Promise<Verification | null> => {
  try {
    const verification = await db.verification.findUnique({
      where: { token, code },
    });

    return verification;
  } catch {
    return null;
  }
};

// TODO: CHECK IF THERE ARE UNUSED
