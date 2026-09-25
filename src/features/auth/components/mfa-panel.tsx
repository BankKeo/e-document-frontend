"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Loader2,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authService } from "../mock/service";
import { useAuth } from "../context/auth-context";
import type { MfaStatus } from "../types";
import { MfaSetupDialog } from "./mfa-setup-dialog";
import { BackupCodesList } from "./backup-codes";

function DisableMfaDialog({
  onClose,
  onDisabled,
}: {
  onClose: () => void;
  onDisabled: () => void;
}) {
  const { user } = useAuth();
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function disable() {
    if (!password) {
      setError("Enter your password to continue.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await authService.disableMfa(user?.email ?? "", password);
      toast.success("Two-factor authentication disabled");
      onDisabled();
      onClose();
    } catch (disableError) {
      setError(
        disableError instanceof Error
          ? disableError.message
          : "Unable to disable two-factor authentication."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable two-factor authentication</DialogTitle>
          <DialogDescription>
            Your account will no longer require a verification code when signing
            in. This reduces security — we recommend keeping it enabled.
          </DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="grid gap-2">
          <label htmlFor="mfa-disable-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="mfa-disable-password"
            type="password"
            autoComplete="current-password"
            placeholder="Confirm your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={disable}
            disabled={busy || !password}
          >
            {busy && <Loader2 className="animate-spin" />}
            Disable MFA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BackupCodesDialog({ onClose }: { onClose: () => void }) {
  const [codes, setCodes] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    authService
      .regenerateBackupCodes()
      .then((nextCodes) => {
        if (!cancelled) setCodes(nextCodes);
      })
      .catch(() => {
        if (!cancelled) setCodes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Backup codes</DialogTitle>
          <DialogDescription>
            Use one code if you ever lose access to your authenticator app. Each
            code can only be used once.
          </DialogDescription>
        </DialogHeader>
        {codes === null ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <BackupCodesList codes={codes} />
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MfaPanel() {
  const [status, setStatus] = React.useState<MfaStatus | null>(null);
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [backupOpen, setBackupOpen] = React.useState(false);
  const [disableOpen, setDisableOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    authService.getMfaStatus().then((nextStatus) => {
      if (!cancelled) setStatus(nextStatus);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function refresh() {
    authService.getMfaStatus().then(setStatus);
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading security settings…
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {status.enabled ? (
        <Card>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
                <ShieldCheck className="size-5" />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Authenticator app ({status.method?.toUpperCase()}) · enabled{" "}
                  {status.enabledAt
                    ? new Date(status.enabledAt).toLocaleDateString()
                    : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  You&apos;ll be asked for a verification code the next time you
                  sign in.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" onClick={() => setBackupOpen(true)}>
                Backup codes
              </Button>
              <Button variant="destructive" onClick={() => setDisableOpen(true)}>
                Disable
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <MonitorSmartphone className="size-5" />
            </div>
            <div className="grid gap-1.5">
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security. You&apos;ll enter a one-time code
                from an authenticator app when signing in.
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <KeyRound className="size-3.5" /> Blocks unauthorized access
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" /> Protects against stolen
                  passwords
                </li>
              </ul>
            </div>
            <Button
              variant="default"
              className="justify-self-start sm:justify-self-end"
              onClick={() => setSetupOpen(true)}
            >
              Enable
            </Button>
          </CardContent>
        </Card>
      )}

      {setupOpen ? (
        <MfaSetupDialog
          open
          onOpenChange={setSetupOpen}
          onEnabled={refresh}
        />
      ) : null}
      {backupOpen ? <BackupCodesDialog onClose={() => setBackupOpen(false)} /> : null}
      {disableOpen ? (
        <DisableMfaDialog
          onClose={() => setDisableOpen(false)}
          onDisabled={refresh}
        />
      ) : null}
    </div>
  );
}