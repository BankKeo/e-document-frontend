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
import { useApprovalEvents } from "../api/audit.queries";
import type { AuditDecision, ApprovalEvent } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";

const DECISIONS: AuditDecision[] = ["Approved", "Rejected", "Requested", "Sent back"];

const columns: ColumnDef<ApprovalEvent>[] = [
  {
    accessorKey: "at",
    header: "When",
    cell: ({ row }) => <TimeCell at={row.original.at} />,
  },
  {
    accessorKey: "documentRef",
    header: "Document",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-mono text-sm font-medium">{row.original.documentRef}</p>
        <p className="text-xs text-muted-foreground">{row.original.documentType}</p>
      </div>
    ),
  },
  {
    accessorKey: "requester",
    header: "Requested by",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.requester}</span>,
  },
  {
    accessorKey: "decision",
    header: "Decision",
    cell: ({ row }) => (
      <StatusBadge status={row.original.decision === "Approved" ? "Approved" : row.original.decision === "Rejected" ? "Rejected" : row.original.decision === "Sent back" ? "Cancelled" : "Pending"} />
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <Badge variant="outline">Level {row.original.level}</Badge>,
  },
  {
    accessorKey: "actor",
    header: "Decided by",
    cell: ({ row }) => (
      <ActorCell name={row.original.actor} email={row.original.actorEmail} />
    ),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-xs text-muted-foreground">
        {row.original.comment || "—"}
      </span>
    ),
  },
];

export function ApprovalHistoryPage() {
  const { data, isPending, isError, refetch } = useApprovalEvents();
  const [decision, setDecision] = React.useState<"All" | AuditDecision>("All");

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => decision === "All" || entry.decision === decision),
    [data, decision]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load approval history.</p>
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
        searchKey="documentRef"
        searchPlaceholder="Search references..."
        emptyTitle="No approval events"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select value={decision} onValueChange={(value) => setDecision(value as typeof decision)}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by decision">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All decisions</SelectItem>
                {DECISIONS.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ExportButton filename="approval-history.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}