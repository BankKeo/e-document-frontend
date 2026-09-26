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
import { useProcurementEvents } from "../api/audit.queries";
import type { ProcurementEvent, ProcurementType } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";

const TYPES: ProcurementType[] = ["Requisition", "Tender", "Contract", "Order"];

const TYPE_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Requisition: "secondary",
  Tender: "outline",
  Contract: "default",
  Order: "default",
};

const columns: ColumnDef<ProcurementEvent>[] = [
  {
    accessorKey: "at",
    header: "When",
    cell: ({ row }) => <TimeCell at={row.original.at} />,
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.reference}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={TYPE_VARIANTS[row.original.type] ?? "secondary"}>
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => <span className="font-medium">{row.original.stage}</span>,
  },
  {
    accessorKey: "actor",
    header: "User",
    cell: ({ row }) => (
      <ActorCell name={row.original.actor} email={row.original.actorEmail} />
    ),
  },
  {
    accessorKey: "detail",
    header: "Detail",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-xs text-muted-foreground">{row.original.detail}</span>
    ),
  },
];

export function ProcurementHistoryPage() {
  const { data, isPending, isError, refetch } = useProcurementEvents();
  const [type, setType] = React.useState<"All" | ProcurementType>("All");

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => type === "All" || entry.type === type),
    [data, type]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load procurement history.</p>
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
        searchKey="reference"
        searchPlaceholder="Search references..."
        emptyTitle="No procurement events"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select value={type} onValueChange={(value) => setType(value as typeof type)}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All types</SelectItem>
                {TYPES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ExportButton filename="procurement-history.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}