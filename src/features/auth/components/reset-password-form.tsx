"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authService } from "../mock/service";
import {
  evaluatePasswordStrength,
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/auth.schemas";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { PasswordStrengthMeter } from "./password-strength";

export function ResetPasswordForm({ token }: { token: string }) {
  const [done, setDone] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [passwordValue, setPasswordValue] = React.useState("");

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const strength = React.useMemo(
    () => evaluatePasswordStrength(passwordValue),
    [passwordValue]
  );

  async function onSubmit(input: ResetPasswordInput) {
    setServerError(null);
    try {
      await authService.resetPassword(token, input.password);
      setDone(true);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to reset your password."
      );
    }
  }

  if (!token) {
    return (
      <div className="grid gap-4">
        <Alert>
          <AlertCircle />
          <AlertTitle>Reset link required</AlertTitle>
          <AlertDescription>
            This page must be opened from a password reset link. Request a new
            one below.
          </AlertDescription>
        </Alert>
        <Link
          href="/forgot-password"
          className="text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Request a reset link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="grid gap-4">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
          <CheckCircle2 className="size-5" />
        </div>
        <div className="grid gap-1 text-center">
          <h2 className="text-sm font-medium">Password updated</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
        </div>
        <Link href="/login" className="text-center">
          <Button type="button" variant="link" className="text-primary">
            Go to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      {serverError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to reset password</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <FormField id="password" label="New password" error={form.formState.errors.password?.message}>
        {({ id, ...fieldProps }) => (
          <PasswordInput
            id={id}
            autoComplete="new-password"
            placeholder="Enter a new password"
            {...fieldProps}
            {...form.register("password", {
              onChange: (event) => setPasswordValue(event.target.value),
            })}
          />
        )}
      </FormField>
      <PasswordStrengthMeter strength={strength} />

      <FormField
        id="confirmPassword"
        label="Confirm password"
        error={form.formState.errors.confirmPassword?.message}
      >
        {({ id, ...fieldProps }) => (
          <PasswordInput
            id={id}
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            {...fieldProps}
            {...form.register("confirmPassword")}
          />
        )}
      </FormField>

      <div className="grid gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Reset password
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