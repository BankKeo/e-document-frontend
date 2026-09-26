"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeftRight,
  CheckCircle2,
  Loader2,
  Plus,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useSetTransferStatus,
  useStockTransfers,
} from "../api/transfer.queries";
import type { StockTransfer } from "../types";
import { CreateTransferDialog } from "./create-transfer-dialog";

export function TransferListPage() {
  const { data, isPending, isError, refetch } = useStockTransfers();
  const setStatus = useSetTransferStatus();
  const [createOpen, setCreateOpen] = React.useState(false);

  const inTransit = (data ?? []).filter(
    (t) => t.status === "In Transit"
  ).length;
  const completed = (data ?? []).filter((t) => t.status === "Completed").length;

  const columns = React.useMemo<ColumnDef<StockTransfer>[]>(() => {
    return [
      {
        accessorKey: "ref",
        header: "Transfer",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">
            {row.original.ref}
          </span>
        ),
      },
      {
        accessorKey: "route",
        header: "Route",
        cell: ({ row }) => (
          <div className="min-w-0 text-sm">
            <span className="text-muted-foreground">
              {row.original.fromWarehouse.split("—")[0].trim()}
            </span>
            <span className="mx-1.5 text-muted-foreground">→</span>
            <span className="text-muted-foreground">
              {row.original.toWarehouse.split("—")[0].trim()}
            </span>
          </div>
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
        accessorKey: "requestedBy",
        header: "Requested by",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.requestedBy}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <StatusBadge status={row.original.status} />
            {row.original.status === "Draft" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  void setStatus
                    .mutateAsync({ id: row.original.id, status: "In Transit" })
                    .then(() => toast.success("Transfer initiated"))
                }
                disabled={setStatus.isPending}
              >
                {setStatus.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Truck />
                )}
                Initiate
              </Button>
            ) : null}
            {row.original.status === "In Transit" ? (
              <Button
                size="sm"
                onClick={() =>
                  void setStatus
                    .mutateAsync({ id: row.original.id, status: "Completed" })
                    .then(() => toast.success("Transfer completed"))
                }
                disabled={setStatus.isPending}
              >
                {setStatus.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 />
                )}
                Complete
              </Button>
            ) : null}
          </div>
        ),
      },
    ];
  }, [setStatus]);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load transfers.</p>
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
          label="Transfers"
          value={data?.length ?? 0}
          icon={ArrowLeftRight}
        />
        <KpiCard label="In transit" value={inTransit} icon={Truck} />
        <KpiCard label="Completed" value={completed} icon={CheckCircle2} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New transfer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        emptyTitle="No transfers"
        emptyDescription="Create a stock transfer between warehouses (STOCK-003)."
      />

      {createOpen ? (
        <CreateTransferDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
