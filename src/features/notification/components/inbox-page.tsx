"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NotificationFeed } from "./notification-feed";
import { KIND_META } from "./kind-meta";
import type { NotificationKind } from "../types";

const FILTERS: Array<{ value: NotificationKind | "All"; label: string }> = [
  { value: "All", label: "All" },
  { value: "approval", label: KIND_META.approval.label },
  { value: "rejection", label: KIND_META.rejection.label },
  { value: "reminder", label: KIND_META.reminder.label },
  { value: "contract", label: KIND_META.contract.label },
  { value: "stock", label: KIND_META.stock.label },
  { value: "system", label: KIND_META.system.label },
];

export function InboxPage() {
  const [filter, setFilter] = React.useState<NotificationKind | "All">("All");

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-1">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            aria-pressed={filter === item.value}
            className={cn(
              "h-7 rounded-md px-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
              filter === item.value && "bg-muted text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <NotificationFeed
        key={filter}
        kind={filter === "All" ? undefined : filter}
        showMarkAll
        emptyTitle={
          filter === "All" ? "You're all caught up" : "Nothing here"
        }
        emptyDescription={
          filter === "All"
            ? "New notifications will appear here."
            : `No ${filter} notifications right now.`
        }
      />
    </div>
  );
}