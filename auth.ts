import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import { Config } from "@/config/app.config";
import { Adapter } from "next-auth/adapters";
import { getUserByEmail } from "./data/user";
import { delayWithHash } from "@/lib/utils";
import { db } from "@/lib/utils/prisma";
import { LoginSchema } from "@/schema";
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider !== "credentials") return true;

        if (!user.id) {
          console.warn("Sign-in attempt with missing user ID");
          await delayWithHash();
          return false;
        }

        if (!user.emailVerified) {
          console.warn(`Sign-in blocked for unverified email: ${user.email}`);
          await delayWithHash();
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        await delayWithHash();
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        Object.assign(token, {
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        });
      }
      if (account) {
        token.provider = account.provider;
      }
      if (trigger === "update" && session) {
        Object.assign(token, {
          ...(session.name && { name: session.name }),
          ...(session.email && { email: session.email }),
          ...(session.role && { role: session.role }),
          ...(session.twoFactorEnabled && {
            twoFactorEnabled: session.twoFactorEnabled,
          }),
        });
      }
      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        Object.assign(session.user, {
          id: token.sub,
          role: token.role,
          twoFactorEnabled: token.twoFactorEnabled,
          provider: token.provider,
        });
      }
      return session;
    },
  },
  secret: Config.AUTH_SECRET,
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: Config.GOOGLE_ID,
      clientSecret: Config.GOOGLE_SECRET,
    }),
    Facebook({
      clientId: Config.FACEBOOK_ID,
      clientSecret: Config.FACEBOOK_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          // if user registered with social
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
});
