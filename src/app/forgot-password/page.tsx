import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password — e-Document",
  description: "Request a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Forgot password"
      subtitle="We'll email you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}