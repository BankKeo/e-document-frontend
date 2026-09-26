"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataChangeEvents } from "../api/audit.queries";
import type { DataChangeEntry } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";

const columns: ColumnDef<DataChangeEntry>[] = [
  {
    accessorKey: "at",
    header: "When",
    cell: ({ row }) => <TimeCell at={row.original.at} />,
  },
  {
    accessorKey: "actor",
    header: "Changed by",
    cell: ({ row }) => (
      <ActorCell name={row.original.actor} email={row.original.actorEmail} />
    ),
  },
  {
    accessorKey: "entity",
    header: "Record",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {row.original.entity} · {row.original.record}
        </p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.entityId}</p>
      </div>
    ),
  },
  {
    accessorKey: "field",
    header: "Field",
    cell: ({ row }) => (
      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
        {row.original.field}
      </span>
    ),
  },
  {
    accessorKey: "oldValue",
    header: "Before",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-muted-foreground">{row.original.oldValue}</span>
    ),
  },
  {
    id: "arrow",
    enableHiding: false,
    header: "",
    cell: () => (
      <ArrowRight className="size-3.5 text-muted-foreground" />
    ),
  },
  {
    accessorKey: "newValue",
    header: "After",
    cell: ({ row }) => (
      <span className="line-clamp-1 font-medium text-foreground">{row.original.newValue}</span>
    ),
  },
];

export function DataChangeHistoryPage() {
  const { data, isPending, isError, refetch } = useDataChangeEvents();
  const [entity, setEntity] = React.useState<"All" | string>("All");

  const entities = React.useMemo(
    () => Array.from(new Set((data ?? []).map((entry) => entry.entity))),
    [data]
  );

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => entity === "All" || entry.entity === entity),
    [data, entity]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load data change history.</p>
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
        searchKey="record"
        searchPlaceholder="Search records..."
        emptyTitle="No data changes"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select
              value={entity}
              onValueChange={(value) => {
                if (value) setEntity(value);
              }}
            >
              <SelectTrigger size="sm" className="w-44" aria-label="Filter by entity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All entities</SelectItem>
                {entities.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ExportButton filename="data-change-history.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}