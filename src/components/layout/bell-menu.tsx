"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from "@/features/notification/api/notification.queries";
import { formatRelative, KIND_META } from "@/features/notification/components/kind-meta";

export function BellMenu() {
  const router = useRouter();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const recent = React.useMemo(() => {
    const items = notifications ?? [];
    return [...items]
      .sort(
        (a, b) =>
          Number(a.read) - Number(b.read) ||
          new Date(b.at).getTime() - new Date(a.at).getTime()
      )
      .slice(0, 5);
  }, [notifications]);

  async function open(notificationId: string) {
    if (!notifications?.find((entry) => entry.id === notificationId)?.read) {
      await markRead.mutateAsync(notificationId);
    }
    router.push("/notifications");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Notifications" />}
      >
        <Bell />
        {unreadCount ? (
          <span className="absolute -top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount ? (
            <button
              type="button"
              onClick={() => void markAllRead.mutateAsync()}
              className="flex items-center gap-1 text-xs font-normal text-primary hover:underline"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recent.length === 0 ? (
          <div className="px-1.5 py-2 text-sm text-muted-foreground">
            You&apos;re all caught up.
          </div>
        ) : (
          <div className="flex flex-col">
            {recent.map((notification) => {
              const Icon = KIND_META[notification.kind].icon;
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="gap-2.5 py-2"
                  onClick={() => void open(notification.id)}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md",
                      notification.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium",
                        !notification.read && "text-foreground"
                      )}
                    >
                      {!notification.read ? (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      ) : null}
                      <span className="truncate">{notification.title}</span>
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatRelative(notification.at)}
                    </span>
                  </span>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/notifications" />}>
          <span className="w-full text-center text-sm font-medium text-primary">
            View all notifications
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}