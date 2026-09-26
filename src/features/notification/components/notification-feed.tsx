"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMarkAllRead, useMarkRead, useNotifications } from "../api/notification.queries";
import type { AppNotification, NotificationKind } from "../types";
import { formatRelative, KIND_META } from "./kind-meta";

export function NotificationRow({
  notification,
  onMarkRead,
  actions,
}: {
  notification: AppNotification;
  onMarkRead?: () => void;
  actions?: (notification: AppNotification) => React.ReactNode;
}) {
  const meta = KIND_META[notification.kind];
  const Icon = meta.icon;
  const markRead = useMarkRead();

  function handleMarkRead() {
    if (onMarkRead) onMarkRead();
    else if (!notification.read) void markRead.mutateAsync(notification.id);
  }

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3 py-3 transition-colors",
        !notification.read
          ? "border-primary/25 bg-primary/[0.04]"
          : "hover:bg-muted/40"
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          notification.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-4.5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          {notification.priority === "high" && !notification.read ? (
            <span className="flex size-1.5 items-center justify-center rounded-full bg-destructive" aria-label="High priority" />
          ) : null}
          <p className="text-sm font-medium">{notification.title}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{notification.body}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {notification.ref ? (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{notification.ref}</code>
          ) : null}
          <span>{formatRelative(notification.at)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {actions ? actions(notification) : null}
        {!notification.read && !actions ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            onClick={handleMarkRead}
            aria-label="Mark as read"
          >
            <Check />
          </Button>
        ) : null}
      </div>
    </li>
  );
}

export function NotificationFeed({
  kind,
  showMarkAll = false,
  emptyTitle,
  emptyDescription,
  actions,
}: {
  kind?: NotificationKind;
  showMarkAll?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  actions?: (notification: AppNotification) => React.ReactNode;
}) {
  const { data, isPending } = useNotifications();
  const markAllRead = useMarkAllRead();

  const rows = React.useMemo(() => {
    const filtered = kind ? (data ?? []).filter((entry) => entry.kind === kind) : (data ?? []);
    return [...filtered].sort(
      (a, b) =>
        Number(a.read) - Number(b.read) ||
        new Date(b.at).getTime() - new Date(a.at).getTime()
    );
  }, [data, kind]);

  const unread = rows.filter((entry) => !entry.read).length;

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading notifications…
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {rows.length} notification{rows.length === 1 ? "" : "s"} · {unread} unread
        </p>
        {showMarkAll && unread > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void markAllRead.mutateAsync()}
            disabled={markAllRead.isPending}
          >
            <Check />
            Mark all read
          </Button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <p className="text-sm font-medium">{emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        </div>
      ) : (
        <ul className="grid gap-2">
          {rows.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} actions={actions} />
          ))}
        </ul>
      )}
    </div>
  );
}