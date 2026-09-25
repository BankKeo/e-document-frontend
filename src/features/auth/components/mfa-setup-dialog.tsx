"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "../mock/service";
import { mfaCodeSchema, type MfaCodeInput } from "../schemas/auth.schemas";
import { MockQrCode } from "./mock-qr-code";
import { FormField } from "./form-field";
import { BackupCodesList, CopyButton } from "./backup-codes";

type Step = "scan" | "verify" | "backup";

function MfaSetupInner({ onDone }: { onDone: () => void }) {
  const [step, setStep] = React.useState<Step>("scan");
  const [error, setError] = React.useState<string | null>(null);
  const [secret, setSecret] = React.useState("");
  const [loadingSecret, setLoadingSecret] = React.useState(true);
  const [backupCodes, setBackupCodes] = React.useState<string[]>([]);

  const form = useForm<MfaCodeInput>({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: { code: "" },
  });

  React.useEffect(() => {
    let cancelled = false;
    authService
      .enableMfa("totp")
      .then(({ secret: nextSecret }) => {
        if (!cancelled) setSecret(nextSecret);
      })
      .finally(() => {
        if (!cancelled) setLoadingSecret(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onVerify(input: MfaCodeInput) {
    setError(null);
    try {
      const result = await authService.verifyMfaSetup(input.code);
      setBackupCodes(result.backupCodes);
      setStep("backup");
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Unable to verify the code."
      );
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {step === "scan" && "Scan the QR code"}
          {step === "verify" && "Verify your code"}
          {step === "backup" && "Save your backup codes"}
        </DialogTitle>
        <DialogDescription>
          {step === "scan" &&
            "Use an authenticator app to scan this code and start generating one-time passwords."}
          {step === "verify" &&
            "Enter the 6-digit code the app is currently displaying."}
          {step === "backup" &&
            "Store these codes somewhere safe — they let you sign in if you lose your device."}
        </DialogDescription>
      </DialogHeader>

      {step === "scan" && (
        <div className="grid gap-4">
          <div className="flex justify-center">
            <div className="grid justify-items-center gap-2">
              {loadingSecret || !secret ? (
                <div className="flex size-36 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <MockQrCode value={secret} size={140} />
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                      {secret}
                    </code>
                    <CopyButton text={secret} label="Secret" />
                  </div>
                </>
              )}
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                setStep("verify");
              }}
            >
              Already scanned — continue
            </Button>
          </DialogFooter>
        </div>
      )}

      {step === "verify" && (
        <form
          onSubmit={form.handleSubmit(onVerify)}
          className="grid gap-4"
          noValidate
        >
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <FormField
            id="code"
            label="Verification code"
            error={form.formState.errors.code?.message}
          >
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
                {...form.register("code")}
              />
            )}
          </FormField>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStep("scan")}
              disabled={form.formState.isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin" />
              )}
              Verify
            </Button>
          </DialogFooter>
        </form>
      )}

      {step === "backup" && (
        <div className="grid gap-4">
          <BackupCodesList codes={backupCodes} />
          <DialogFooter>
            <Button type="button" onClick={onDone}>
              Done
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}

export function MfaSetupDialog({
  open,
  onOpenChange,
  onEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnabled: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <MfaSetupInner
          onDone={() => {
            onEnabled();
            onOpenChange(false);
          }}
        />
      ) : null}
    </Dialog>
  );
}