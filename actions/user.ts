import { User } from "@prisma/client";
import { prisma } from "@/lib/utils/prisma";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

// export const getUserById = async (
//   id: string | undefined,
// ): Promise<User | null> => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     return user;
//   } catch {
//     return null;
//   }
// };
