"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpFromLine, Package, Plus, ClipboardList } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useOutboundIssues } from "../api/outbound.queries";
import type { OutboundIssue } from "../types";
import { CreateOutboundDialog } from "./create-outbound-dialog";

export function OutboundListPage() {
  const { data, isPending, isError, refetch } = useOutboundIssues();
  const [createOpen, setCreateOpen] = React.useState(false);

  const pending = (data ?? []).filter((o) =>
    ["Requested", "Approved"].includes(o.status)
  );
  const processing = (data ?? []).filter((o) =>
    ["Picking", "Packed"].includes(o.status)
  );
  const issued = (data ?? []).filter((o) =>
    ["Issued", "Delivered"].includes(o.status)
  ).length;

  const columns = React.useMemo<ColumnDef<OutboundIssue>[]>(() => {
    return [
      {
        accessorKey: "ref",
        header: "Issue",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/warehouse/outbound/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.ref}
            </Link>
            <p className="text-xs text-muted-foreground">
              {row.original.department} · {row.original.requester}
            </p>
          </div>
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
        accessorKey: "lines",
        header: "Lines",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.lines.length}
          </span>
        ),
      },
      {
        accessorKey: "requestedAt",
        header: "Requested",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.requestedAt).toLocaleDateString()}
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
              href={`/warehouse/outbound/${row.original.id}`}
              className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
            >
              Process
            </Link>
          </div>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load outbound issues.</p>
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
          label="Pending approval"
          value={pending.length}
          icon={ClipboardList}
        />
        <KpiCard
          label="Picking / packing"
          value={processing.length}
          icon={Package}
        />
        <KpiCard label="Issued" value={issued} icon={ArrowUpFromLine} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New issue request
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="department"
        searchPlaceholder="Search outbound issues..."
        emptyTitle="No outbound issues"
        emptyDescription="Create an issue request to start outbound processing."
      />

      {createOpen ? (
        <CreateOutboundDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
