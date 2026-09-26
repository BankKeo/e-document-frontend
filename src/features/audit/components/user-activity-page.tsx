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
import { useActivityEvents } from "../api/audit.queries";
import type { ActivityModule, UserActivityEvent } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";

const MODULES: ActivityModule[] = ["DMS", "Procurement", "Warehouse", "Administration", "Auth"];

const columns: ColumnDef<UserActivityEvent>[] = [
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
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => <Badge>{row.original.module}</Badge>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span className="font-medium">{row.original.action}</span>,
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.target}</span>,
  },
  {
    accessorKey: "detail",
    header: "Detail",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-xs text-muted-foreground">{row.original.detail}</span>
    ),
  },
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => <span className="whitespace-nowrap text-muted-foreground">{row.original.ip}</span>,
  },
];

export function UserActivityPage() {
  const { data, isPending, isError, refetch } = useActivityEvents();
  const [module, setModule] = React.useState<"All" | ActivityModule>("All");

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => module === "All" || entry.module === module),
    [data, module]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load user activity.</p>
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
        emptyTitle="No activity"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select value={module} onValueChange={(value) => setModule(value as typeof module)}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by module">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All modules</SelectItem>
                {MODULES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ExportButton filename="user-activity.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}