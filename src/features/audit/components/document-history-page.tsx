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
import { useDocumentEvents } from "../api/audit.queries";
import type { DocumentAction, DocumentHistoryEntry } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";

const ACTION_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Created: "default",
  Edited: "secondary",
  Viewed: "outline",
  Downloaded: "outline",
  Approved: "default",
  Rejected: "destructive",
  Deleted: "destructive",
};

const ACTIONS: DocumentAction[] = [
  "Created",
  "Edited",
  "Viewed",
  "Downloaded",
  "Approved",
  "Rejected",
  "Deleted",
];

const columns: ColumnDef<DocumentHistoryEntry>[] = [
  {
    accessorKey: "at",
    header: "When",
    cell: ({ row }) => <TimeCell at={row.original.at} />,
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{row.original.document}</p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.documentRef} · {row.original.version}</p>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Badge variant={ACTION_VARIANTS[row.original.action] ?? "secondary"}>
        {row.original.action}
      </Badge>
    ),
  },
  {
    accessorKey: "actor",
    header: "User",
    cell: ({ row }) => (
      <ActorCell name={row.original.actor} email={row.original.actorEmail} />
    ),
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-xs text-muted-foreground">{row.original.summary}</span>
    ),
  },
];

export function DocumentHistoryPage() {
  const { data, isPending, isError, refetch } = useDocumentEvents();
  const [action, setAction] = React.useState<"All" | DocumentAction>("All");

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => action === "All" || entry.action === action),
    [data, action]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load document history.</p>
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
        searchKey="document"
        searchPlaceholder="Search documents..."
        emptyTitle="No document events"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select value={action} onValueChange={(value) => setAction(value as typeof action)}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by action">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All actions</SelectItem>
                {ACTIONS.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ExportButton filename="document-history.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}