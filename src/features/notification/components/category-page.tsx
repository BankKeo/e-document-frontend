"use client";

import * as React from "react";
import { toast } from "sonner";
import { Ban, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationFeed } from "./notification-feed";
import { useResolveNotification } from "../api/notification.queries";
import type { AppNotification, NotificationKind } from "../types";

function ApprovalActions({ notification }: { notification: AppNotification }) {
  const resolve = useResolveNotification();
  const busy = resolve.isPending;

  async function decide(resolution: "approved" | "rejected") {
    try {
      await resolve.mutateAsync({ id: notification.id, resolution });
      toast.success(
        resolution === "approved" ? "Request approved" : "Request rejected"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        onClick={() => void decide("approved")}
        disabled={busy || notification.read}
      >
        {busy ? <Loader2 className="animate-spin" /> : <Check />}
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => void decide("rejected")}
        disabled={busy || notification.read}
        aria-label="Reject"
      >
        <Ban />
      </Button>
    </div>
  );
}

const CATEGORY_CONFIG: Record<
  Exclude<NotificationKind, "system">,
  { emptyTitle: string; emptyDescription: string; actions?: boolean }
> = {
  approval: {
    emptyTitle: "No pending approvals",
    emptyDescription: "Requests that need your decision will appear here.",
    actions: true,
  },
  rejection: {
    emptyTitle: "No rejections",
    emptyDescription: "Submissions returned to you will appear here.",
  },
  reminder: {
    emptyTitle: "No reminders",
    emptyDescription: "Task and deadline reminders will appear here.",
  },
  contract: {
    emptyTitle: "No contract alerts",
    emptyDescription: "Contracts approaching expiration will appear here.",
  },
  stock: {
    emptyTitle: "Stock levels healthy",
    emptyDescription: "Items below reorder level will appear here.",
  },
};

export function CategoryPage({ kind }: { kind: Exclude<NotificationKind, "system"> }) {
  const config = CATEGORY_CONFIG[kind];

  return (
    <NotificationFeed
      kind={kind}
      emptyTitle={config.emptyTitle}
      emptyDescription={config.emptyDescription}
      actions={
        config.actions
          ? (notification) => <ApprovalActions notification={notification} />
          : undefined
      }
    />
  );
}