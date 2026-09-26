"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, MailCheck, Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useEmailNotifications,
  useEmailPreferences,
  useUpdateEmailPreference,
} from "../api/notification.queries";
import type { EmailNotification } from "../types";

const TEMPLATE_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "Approval Required": "default",
  "Request Sent Back": "destructive",
  "Task Reminder": "secondary",
  "Contract Expiry": "outline",
  "Low Stock Alert": "outline",
  "Weekly Digest": "secondary",
};

const columns: ColumnDef<EmailNotification>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span className="font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "to",
    header: "Recipient",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm">{row.original.toName}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.to}</p>
      </div>
    ),
  },
  {
    accessorKey: "template",
    header: "Template",
    cell: ({ row }) => (
      <Badge variant={TEMPLATE_VARIANTS[row.original.template] ?? "secondary"}>
        {row.original.template}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "at",
    header: "Sent",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {new Date(row.original.at).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
];

export function EmailNotificationsPage() {
  const { data: emails, isPending } = useEmailNotifications();
  const { data: preferences, isPending: prefsPending } = useEmailPreferences();
  const updatePreference = useUpdateEmailPreference();

  async function toggle(key: string, enabled: boolean) {
    try {
      await updatePreference.mutateAsync({ key, enabled });
      toast.success(enabled ? "Email enabled" : "Email paused");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email preferences</CardTitle>
          <CardDescription>
            Choose which notification types are sent to your inbox and how.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {prefsPending || !preferences ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading preferences…
            </div>
          ) : (
            <ul className="grid gap-2">
              {preferences.map((preference) => (
                <li key={preference.key}>
                  <Label
                    htmlFor={`pref-${preference.key}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-2.5"
                  >
                    <Checkbox
                      id={`pref-${preference.key}`}
                      checked={preference.enabled}
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") void toggle(preference.key, checked);
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{preference.label}</p>
                        <Badge variant="outline">
                          {preference.channel === "immediate" ? "Immediate" : "Digest"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {preference.description}
                      </p>
                    </div>
                    <Mail className="size-4 text-muted-foreground" />
                  </Label>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-3">
        <div className="flex items-center gap-2">
          <MailCheck className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Recently sent</h3>
        </div>
        <DataTable
          columns={columns}
          data={emails ?? []}
          isLoading={isPending}
          searchKey="subject"
          searchPlaceholder="Search emails..."
          emptyTitle="No emails sent"
          emptyDescription="Emails generated by your notification rules will appear here."
        />
      </section>
    </div>
  );
}