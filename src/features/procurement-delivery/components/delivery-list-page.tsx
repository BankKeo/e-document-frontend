"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CheckCircle2, Plus, Truck, TruckIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useDeliveries } from "../api/delivery.queries";
import type { Delivery } from "../types";
import { CreateDeliveryDialog } from "./create-delivery-dialog";

export function DeliveryListPage() {
  const { data, isPending, isError, refetch } = useDeliveries();
  const [createOpen, setCreateOpen] = React.useState(false);

  const incoming = (data ?? []).filter((d) =>
    ["Scheduled", "Shipped"].includes(d.status)
  );
  const received = (data ?? []).filter((d) =>
    ["Received", "Partially Received"].includes(d.status)
  );
  const delayed = (data ?? []).filter((d) => d.status === "Delayed");
  const confirmed = (data ?? []).filter((d) => d.status === "Confirmed").length;

  const columns = React.useMemo<ColumnDef<Delivery>[]>(() => {
    return [
      {
        accessorKey: "ref",
        header: "Delivery",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/procurement/deliveries/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.ref}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.purchaseOrderRef}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.supplier}</span>
        ),
      },
      {
        accessorKey: "scheduledDate",
        header: "Scheduled",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.scheduledDate).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: "lines",
        header: "Lines",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.lines.length}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link
              href={`/procurement/deliveries/${row.original.id}`}
              className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
            >
              View
            </Link>
          </div>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load deliveries.</p>
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
        <KpiCard label="Incoming" value={incoming.length} icon={Truck} />
        <KpiCard label="Receiving" value={received.length} icon={TruckIcon} />
        <KpiCard
          label="Delayed"
          value={delayed.length}
          icon={Truck}
          trendDirection="down"
        />
        <KpiCard label="Confirmed" value={confirmed} icon={CheckCircle2} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New delivery
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="supplier"
        searchPlaceholder="Search deliveries..."
        emptyTitle="No deliveries"
        emptyDescription="Schedule your first delivery from a purchase order."
      />

      {createOpen ? (
        <CreateDeliveryDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
