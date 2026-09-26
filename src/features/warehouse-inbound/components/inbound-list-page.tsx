"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowDownToLine, PackageCheck, Plus, Truck } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useInboundOrders } from "../api/inbound.queries";
import type { InboundOrder } from "../types";
import { CreateInboundDialog } from "./create-inbound-dialog";

export function InboundListPage() {
  const { data, isPending, isError, refetch } = useInboundOrders();
  const [createOpen, setCreateOpen] = React.useState(false);

  const incoming = (data ?? []).filter((o) =>
    ["Scheduled", "Arrived"].includes(o.status)
  );
  const inspected = (data ?? []).filter((o) => o.status === "Inspected");
  const received = (data ?? []).filter(
    (o) => o.status === "Received" || o.status === "Put-away"
  );

  const columns = React.useMemo<ColumnDef<InboundOrder>[]>(() => {
    return [
      {
        accessorKey: "ref",
        header: "Order",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/warehouse/inbound/${row.original.id}`}
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
        accessorKey: "warehouse",
        header: "Warehouse",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.warehouse}
          </span>
        ),
      },
      {
        accessorKey: "scheduledAt",
        header: "Arrival",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.scheduledAt).toLocaleDateString()}
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
              href={`/warehouse/inbound/${row.original.id}`}
              className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
            >
              Receive
            </Link>
          </div>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load inbound orders.</p>
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
        <KpiCard label="Incoming" value={incoming.length} icon={Truck} />
        <KpiCard
          label="Waiting inspection"
          value={inspected.length}
          icon={PackageCheck}
        />
        <KpiCard
          label="Received / put-away"
          value={received.length}
          icon={ArrowDownToLine}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New receiving order
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="supplier"
        searchPlaceholder="Search inbound orders..."
        emptyTitle="No inbound orders"
        emptyDescription="Create a receiving order from a purchase order."
      />

      {createOpen ? (
        <CreateInboundDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
