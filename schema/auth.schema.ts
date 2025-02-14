import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, { message: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be more than 8 characters" })
    .max(32, { message: "Password must be less than 32 characters" }),
  code: z.string().optional(),
});

export const OtpSchema = z.object({
  code: z
    .string({ required_error: "OTP code is required" })
    .min(6, { message: "OTP must be exactly 6 digits" })
    .max(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
});

export const VerifyLinkSchema = z.object({
  target: z.string({ required_error: "Target is required" }),
  token: z.string({ required_error: "Token is required" }),
});

export const VerifyEmailSchema = z.object({
  token: z.string({ required_error: "Token is required" }),
  code: z
    .string({ required_error: "OTP code is required" })
    .min(6, { message: "OTP must be exactly 6 digits" })
    .max(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
});

export const ResetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
});

export const NewPasswordSchema = z
  .object({
    code: z
      .string({ required_error: "OTP code is required" })
      .min(6, { message: "OTP must be exactly 6 digits" })
      .max(6, { message: "OTP must be exactly 6 digits" })
      .regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
