"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return (
    <AuthPageShell
      title="Reset password"
      subtitle="Choose a new password for your account."
    >
      <ResetPasswordForm token={token} />
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthPageShell
          title="Reset password"
          subtitle="Choose a new password for your account."
        >
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        </AuthPageShell>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}