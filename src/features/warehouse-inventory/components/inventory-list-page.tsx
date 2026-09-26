"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Boxes,
  Package,
  Plus,
  TriangleAlert,
  Warehouse,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useInventoryItems } from "../api/inventory.queries";
import type { InventoryItem } from "../types";
import { lowStock, overstock } from "../utils";
import { CreateItemDialog } from "./create-item-dialog";

export function InventoryListPage() {
  const { data, isPending, isError, refetch } = useInventoryItems();
  const [createOpen, setCreateOpen] = React.useState(false);

  const lowStockItems = (data ?? []).filter(lowStock);
  const overstockItems = (data ?? []).filter(overstock);
  const totalUnits = (data ?? []).reduce(
    (sum, item) => sum + item.currentStock,
    0
  );
  const activeItems = (data ?? []).filter(
    (item) => item.itemStatus === "Active"
  ).length;

  const columns = React.useMemo<ColumnDef<InventoryItem>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Item",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/warehouse/inventory/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.sku} · {row.original.barcode}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.category}</Badge>
        ),
      },
      {
        accessorKey: "currentStock",
        header: "On hand",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">
            {row.original.currentStock}
            <span className="text-xs text-muted-foreground">
              {" "}
              {row.original.unit}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "reservedStock",
        header: "Reserved",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {row.original.reservedStock > 0 ? row.original.reservedStock : "—"}
          </span>
        ),
      },
      {
        accessorKey: "reorderPoint",
        header: "Reorder pt.",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {row.original.reorderPoint}
          </span>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.location}
          </span>
        ),
      },
      {
        id: "status",
        enableHiding: false,
        header: "Status",
        cell: ({ row }) => {
          if (overstock(row.original)) {
            return (
              <Badge
                variant="outline"
                className="text-amber-700 dark:text-amber-400"
              >
                <ArrowUp className="size-3" /> Overstock
              </Badge>
            );
          }
          if (lowStock(row.original)) {
            return (
              <Badge variant="destructive">
                <ArrowDown className="size-3" /> Low stock
              </Badge>
            );
          }
          return <Badge variant="secondary">OK</Badge>;
        },
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load inventory.</p>
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
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active items" value={activeItems} icon={Package} />
        <KpiCard label="Units on hand" value={totalUnits} icon={Boxes} />
        <KpiCard
          label="Low stock"
          value={lowStockItems.length}
          icon={TriangleAlert}
          trend="Below reorder point"
          trendDirection="down"
        />
        <KpiCard
          label="Overstock"
          value={overstockItems.length}
          icon={Warehouse}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search items (SKU, barcode, name)..."
        emptyTitle="No items"
        emptyDescription="Add items to your product master to begin inventory (ITEM-001)."
      />

      {createOpen ? (
        <CreateItemDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
