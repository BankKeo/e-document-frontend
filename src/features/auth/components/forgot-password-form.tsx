"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "../mock/service";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/auth.schemas";
import { FormField } from "./form-field";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [sent, setSent] = React.useState(false);
  const [resetToken, setResetToken] = React.useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(input: ForgotPasswordInput) {
    const { resetToken: token } = await authService.requestPasswordReset(
      input.email
    );
    setResetToken(token);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="grid gap-4">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
          <MailCheck className="size-5" />
        </div>
        <div className="grid gap-1 text-center">
          <h2 className="text-sm font-medium">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, we&apos;ve sent a password reset
            link. It expires in 30 minutes.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium">Sandbox note</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No email is really sent. Use the button below to open the demo reset
            link.
          </p>
          {resetToken ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="mt-1 h-auto p-0 text-xs"
              onClick={() => router.push(`/reset-password?token=${resetToken}`)}
            >
              Open mock reset link
            </Button>
          ) : null}
        </div>

        <Link
          href="/login"
          className="text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <p className="text-sm text-muted-foreground">
        Enter the email address associated with your account and we&apos;ll send
        you instructions to reset your password.
      </p>

      <FormField id="email" label="Email" error={form.formState.errors.email?.message}>
        {({ id, ...fieldProps }) => (
          <Input
            id={id}
            type="email"
            autoComplete="email"
            placeholder="you@example.gov"
            {...fieldProps}
            {...form.register("email")}
          />
        )}
      </FormField>

      <div className="grid gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Send reset link
        </Button>
        <Link
          href="/login"
          className="text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}