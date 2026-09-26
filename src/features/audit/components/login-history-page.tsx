"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLoginEvents } from "../api/audit.queries";
import type { LoginEvent } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";

const columns: ColumnDef<LoginEvent>[] = [
  {
    accessorKey: "at",
    header: "When",
    cell: ({ row }) => <TimeCell at={row.original.at} />,
  },
  {
    accessorKey: "actor",
    header: "User",
    cell: ({ row }) => (
      <ActorCell name={row.original.actor} email={row.original.actorEmail} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => <Badge variant="outline">{row.original.method}</Badge>,
  },
  {
    accessorKey: "device",
    header: "Device",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.device} · {row.original.browser}
      </span>
    ),
  },
  {
    accessorKey: "ip",
    header: "Location / IP",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.location} · {row.original.ip}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Details",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.reason || "—"}
      </span>
    ),
  },
];

export function LoginHistoryPage() {
  const { data, isPending, isError, refetch } = useLoginEvents();
  const [status, setStatus] = React.useState<"All" | "Success" | "Failed">("All");

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => status === "All" || entry.status === status),
    [data, status]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load login history.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="justify-self-start text-sm text-primary underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isPending}
        searchKey="actor"
        searchPlaceholder="Search users..."
        emptyTitle="No login events"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger size="sm" className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton filename="login-history.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}