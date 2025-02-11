import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(
      z
        .string({ required_error: "Name is required" })
        .min(1, { message: "Name is required" }),
    ),
    email: z.optional(
      z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email" }),
    ),
    role: z.nativeEnum(UserRole),
    password: z.optional(
      z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
    ),
    newPassword: z.optional(
      z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
    ),
    twoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );
