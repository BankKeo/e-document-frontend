"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "../mock/service";
import { useAuth } from "../context/auth-context";
import {
  changePasswordSchema,
  evaluatePasswordStrength,
  type ChangePasswordInput,
} from "../schemas/auth.schemas";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";
import { PasswordStrengthMeter } from "./password-strength";

export function ChangePasswordForm() {
  const { user } = useAuth();
  const [passwordValue, setPasswordValue] = React.useState("");

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const strength = React.useMemo(
    () => evaluatePasswordStrength(passwordValue),
    [passwordValue]
  );

  async function onSubmit(input: ChangePasswordInput) {
    await authService.changePassword(
      user?.email ?? "",
      input.currentPassword,
      input.password
    );
    form.reset();
    setPasswordValue("");
    toast.success("Password updated");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <FormField
        id="currentPassword"
        label="Current password"
        error={form.formState.errors.currentPassword?.message}
      >
        {({ id, ...fieldProps }) => (
          <PasswordInput
            id={id}
            autoComplete="current-password"
            placeholder="Enter your current password"
            {...fieldProps}
            {...form.register("currentPassword")}
          />
        )}
      </FormField>

      <FormField
        id="password"
        label="New password"
        hint="Use at least 8 characters with a mix of upper and lowercase letters, numbers, and symbols."
        error={form.formState.errors.password?.message}
      >
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
        label="Confirm new password"
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

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
        Change password
      </Button>
    </form>
  );
}