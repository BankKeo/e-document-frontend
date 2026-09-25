"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/auth-context";
import { loginSchema, mfaCodeSchema, type LoginInput } from "../schemas/auth.schemas";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { MOCK_DEMO_CREDENTIALS } from "../mock/service";

const REMEMBER_EMAIL_KEY = "auth.rememberEmail";

export function LoginForm() {
  const { signIn, completeMfa } = useAuth();
  const router = useRouter();
  const [step, setStep] = React.useState<"credentials" | "mfa">("credentials");
  const [serverError, setServerError] = React.useState<string | null>(null);

  const credentials = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const mfa = useForm({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: { code: "" },
  });

  React.useEffect(() => {
    const saved = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (saved) {
      const id = window.setTimeout(() => {
        credentials.setValue("email", saved);
      }, 0);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmitCredentials(input: LoginInput) {
    setServerError(null);
    try {
      const result = await signIn(input.email, input.password, input.remember);
      if (result.kind === "mfa") {
        setStep("mfa");
        return;
      }
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, input.remember ? input.email : "");
      router.replace("/");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to sign in.");
    }
  }

  async function onSubmitMfa(input: { code: string }) {
    setServerError(null);
    try {
      await completeMfa(input.code);
      router.replace("/");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to verify code.");
    }
  }

  if (step === "mfa") {
    return (
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <p className="text-sm text-foreground/80">
            Two-factor authentication
          </p>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app to verify it&apos;s
            you.
          </p>
        </div>

        <form onSubmit={mfa.handleSubmit(onSubmitMfa)} className="grid gap-4" noValidate>
          {serverError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Verification failed</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          <FormField id="code" label="Verification code" error={mfa.formState.errors.code?.message}>
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                placeholder="123456"
                className="text-center font-mono text-base tracking-[0.5em]"
                {...fieldProps}
                {...mfa.register("code")}
              />
            )}
          </FormField>

          <div className="grid gap-2">
            <Button type="submit" disabled={mfa.formState.isSubmitting}>
              {mfa.formState.isSubmitting && <Loader2 className="animate-spin" />}
              Verify
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStep("credentials");
                setServerError(null);
              }}
            >
              Back to sign in
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form
      onSubmit={credentials.handleSubmit(onSubmitCredentials)}
      className="grid gap-4"
      noValidate
    >
      {serverError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <FormField id="email" label="Email" error={credentials.formState.errors.email?.message}>
        {({ id, ...fieldProps }) => (
          <Input
            id={id}
            type="email"
            autoComplete="email"
            placeholder="you@example.gov"
            {...fieldProps}
            {...credentials.register("email")}
          />
        )}
      </FormField>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormField
          id="password"
          error={credentials.formState.errors.password?.message}
        >
          {({ id, ...fieldProps }) => (
            <PasswordInput
              id={id}
              autoComplete="current-password"
              placeholder="••••••••"
              {...fieldProps}
              {...credentials.register("password")}
            />
          )}
        </FormField>
      </div>

      <Controller
        control={credentials.control}
        name="remember"
        render={({ field }) => (
          <Label htmlFor="remember" className="justify-self-start gap-2 text-muted-foreground">
            <Checkbox
              id="remember"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
            Keep me signed in on this device
          </Label>
        )}
      />

      <Button type="submit" disabled={credentials.formState.isSubmitting}>
        {credentials.formState.isSubmitting && <Loader2 className="animate-spin" />}
        Sign in
      </Button>

      <div className="rounded-lg border bg-muted/40 p-3">
        <p className="text-xs font-medium">Demo access</p>
        <div className="mt-1 font-mono text-xs text-muted-foreground">
          {MOCK_DEMO_CREDENTIALS.email} / {MOCK_DEMO_CREDENTIALS.password}
        </div>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-1 h-auto p-0 text-xs"
          onClick={() => {
            credentials.setValue("email", MOCK_DEMO_CREDENTIALS.email);
            credentials.setValue("password", MOCK_DEMO_CREDENTIALS.password);
            credentials.clearErrors();
          }}
        >
          Use demo credentials
        </Button>
      </div>
    </form>
  );
}