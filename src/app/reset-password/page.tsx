import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password — e-Document",
  description: "Choose a new password.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthPageShell
      title="Reset password"
      subtitle="Choose a new password for your account."
    >
      <ResetPasswordForm token={token ?? ""} />
    </AuthPageShell>
  );
}