"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  Building2,
  Plus,
  Users,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useWarehouses } from "../api/warehouse.queries";
import type { Warehouse } from "../types";
import { capacityLabel } from "../utils";
import { CreateWarehouseDialog } from "./create-warehouse-dialog";

export function WarehouseListPage() {
  const { data, isPending, isError, refetch } = useWarehouses();
  const [createOpen, setCreateOpen] = React.useState(false);

  const totalCapacity = (data ?? []).reduce((sum, w) => sum + w.capacity, 0);
  const totalUsed = (data ?? []).reduce((sum, w) => sum + w.used, 0);
  const totalStaff = (data ?? []).reduce((sum, w) => sum + w.staff, 0);
  const utilization = totalCapacity
    ? Math.round((totalUsed / totalCapacity) * 100)
    : 0;

  const columns = React.useMemo<ColumnDef<Warehouse>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Warehouse",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/warehouse/warehouses/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.code}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.location}</span>
        ),
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {capacityLabel(row.original.capacity)}
          </span>
        ),
      },
      {
        accessorKey: "used",
        header: "Utilization",
        cell: ({ row }) => {
          const pct = row.original.capacity
            ? Math.round((row.original.used / row.original.capacity) * 100)
            : 0;
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {pct}%
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "staff",
        header: "Staff",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3.5" />
            {row.original.staff}
          </span>
        ),
      },
      {
        accessorKey: "zones",
        header: "Zones",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.zones.length}
          </span>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load warehouses.</p>
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
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total capacity"
          value={capacityLabel(totalCapacity)}
          icon={WarehouseIcon}
        />
        <KpiCard
          label="Utilization"
          value={`${utilization}%`}
          icon={Building2}
        />
        <KpiCard label="Warehouse staff" value={totalStaff} icon={Users} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New warehouse
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search warehouses..."
        emptyTitle="No warehouses"
        emptyDescription="Create a warehouse to define its zones and racks."
      />

      {createOpen ? (
        <CreateWarehouseDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
