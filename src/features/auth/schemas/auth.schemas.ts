import { z } from "zod";
import type { PasswordStrength } from "../types";

const email = z.string().trim().email("Enter a valid email address.");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
  remember: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((value) => value.password !== value.currentPassword, {
    message: "New password must be different from your current password.",
    path: ["password"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const mfaCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app."),
});

export type MfaCodeInput = z.infer<typeof mfaCodeSchema>;

const PASSWORD_CHECKS = (value: string) => [
  { label: "At least 8 characters", met: value.length >= 8 },
  { label: "An uppercase letter", met: /[A-Z]/.test(value) },
  { label: "A lowercase letter", met: /[a-z]/.test(value) },
  { label: "A number", met: /[0-9]/.test(value) },
  { label: "A symbol", met: /[^A-Za-z0-9]/.test(value) },
];

export function evaluatePasswordStrength(value: string): PasswordStrength {
  const checks = PASSWORD_CHECKS(value);
  const met = checks.filter((check) => check.met).length;

  const score = value.length === 0 ? 0 : (met as 0 | 1 | 2 | 3 | 4);

  const labels: Record<number, string> = {
    0: "Too weak",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  return { score, label: labels[Math.min(score, 4)] ?? "Too weak", checks };
}