"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, MonitorSmartphone, RefreshCw, ShieldEllipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authService } from "../mock/service";
import { useAuth } from "../context/auth-context";
import type { UserSession } from "../types";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

function remainingLabel(expiresAt: string): string {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) return "expired";
  const minutes = Math.floor(remainingMs / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export function SessionsPanel() {
  const { tokens, refreshSession } = useAuth();
  const [sessions, setSessions] = React.useState<UserSession[] | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    authService.listSessions().then((next) => {
      if (!cancelled) setSessions(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleRefreshSession() {
    setRefreshing(true);
    try {
      await refreshSession();
    } catch {
      toast.error("Unable to refresh the session.");
    } finally {
      setRefreshing(false);
    }
  }

  async function revoke(id: string) {
    await authService.revokeSession(id);
    setSessions((current) => current?.filter((session) => session.id !== id) ?? null);
    toast.success("Session signed out");
  }

  async function revokeAll() {
    await authService.revokeAllSessions();
    setSessions((current) => current?.filter((session) => session.isCurrent) ?? null);
    toast.success("All other sessions signed out");
  }

  if (!sessions) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading sessions…
      </div>
    );
  }

  const current = sessions.find((session) => session.isCurrent) ?? sessions[0];
  const others = sessions.filter((session) => !session.isCurrent);

  return (
    <div className="grid gap-6">
      <Card className="ring-2 ring-primary/30">
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MonitorSmartphone className="size-5" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium">
                  {current.label} <Badge variant="default">Current session</Badge>
                </p>
                <p className="text-xs text-muted-foreground">
                  {current.device} · {current.browser} · {current.os}
                </p>
                <p className="text-xs text-muted-foreground">
                  {current.location} · {current.ip} · Active now
                </p>
              </div>
            </div>
            {/* AUTH-003 — refresh keeps the current session alive */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshSession}
              disabled={refreshing}
            >
              <RefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh session
            </Button>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldEllipsis className="size-4" />
              Access token expires in{" "}
              <span className="font-medium text-foreground">
                {tokens ? remainingLabel(tokens.accessTokenExpiresAt) : "—"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Refresh token rotates silently on expiry
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium">Active sessions</h3>
          <p className="text-xs text-muted-foreground">
            {others.length} other device{others.length === 1 ? "" : "s"}
          </p>
        </div>

        {others.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No other active sessions.
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {others.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{session.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.browser} · {session.os} · {session.location} ·{" "}
                    {session.ip}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {session.lastActiveAt}
                  </p>
                </div>
                <ConfirmDialog
                  title="Sign out this session?"
                  description={`This will end the session on "${session.label}" (${session.browser}). You can sign in again anytime.`}
                  confirmLabel="Sign out session"
                  onConfirm={() => revoke(session.id)}
                  trigger={
                    <Button variant="ghost" size="sm" className="shrink-0 text-muted-foreground">
                      Sign out
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}

        {others.length > 0 ? (
          <div>
            <ConfirmDialog
              title="Sign out all other sessions?"
              description="You'll be signed out of all devices except this one. Any unsaved work on those devices may be lost."
              confirmLabel="Sign out all"
              onConfirm={revokeAll}
              trigger={
                <Button variant="outline" size="sm">
                  Sign out all other sessions
                </Button>
              }
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}