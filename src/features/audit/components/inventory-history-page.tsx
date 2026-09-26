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
import { useInventoryEvents } from "../api/audit.queries";
import type { InventoryEntry, InventoryTransactionType } from "../types";
import { ActorCell, ExportButton, TimeCell } from "./shared-audit";
import { signNumber } from "../utils";

const TYPES: InventoryTransactionType[] = ["In", "Out", "Adjustment", "Transfer"];

const TYPE_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  In: "default",
  Out: "destructive",
  Adjustment: "secondary",
  Transfer: "outline",
};

const columns: ColumnDef<InventoryEntry>[] = [
  {
    accessorKey: "at",
    header: "When",
    cell: ({ row }) => <TimeCell at={row.original.at} />,
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{row.original.item}</p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.sku}</p>
      </div>
    ),
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.warehouse}</span>,
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
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => (
      <span
        className={
          row.original.quantity >= 0
            ? "font-medium tabular-nums text-emerald-600 dark:text-emerald-500"
            : "font-medium tabular-nums text-destructive"
        }
      >
        {signNumber(row.original.quantity)}
      </span>
    ),
  },
  {
    accessorKey: "balanceAfter",
    header: "Balance",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">{row.original.balanceAfter.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.reference}</span>,
  },
  {
    accessorKey: "actor",
    header: "User",
    cell: ({ row }) => (
      <ActorCell name={row.original.actor} email={row.original.actorEmail} />
    ),
  },
];

export function InventoryHistoryPage() {
  const { data, isPending, isError, refetch } = useInventoryEvents();
  const [type, setType] = React.useState<"All" | InventoryTransactionType>("All");

  const rows = React.useMemo(
    () => (data ?? []).filter((entry) => type === "All" || entry.type === type),
    [data, type]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load inventory transactions.</p>
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
        searchKey="item"
        searchPlaceholder="Search items..."
        emptyTitle="No transactions"
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
            <ExportButton filename="inventory-history.csv" rows={rows as unknown as Record<string, unknown>[]} />
          </>
        }
      />
    </div>
  );
}