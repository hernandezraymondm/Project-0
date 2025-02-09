/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";

export type UserSessionType = DefaultSession["user"] & {
  role: UserRole;
  twoFactorEnabled: boolean;
};

// declare module "next-auth" {
//   interface Session {
//     user: ExtendedUser;
//   }
// }

declare module "next-auth" {
  interface User {
    role: UserRole;
    emailVerified: Date | null;
    twoFactorEnabled: boolean;
  }

  interface Session {
    user: {
      role: UserRole;
      twoFactorEnabled: boolean;
      provider: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    twoFactorEnabled: boolean;
    provider: string;
  }
}
