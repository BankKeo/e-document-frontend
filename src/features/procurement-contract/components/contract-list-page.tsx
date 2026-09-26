"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  CircleDollarSign,
  FileSignature,
  Plus,
  TimerReset,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useContracts } from "../api/contract.queries";
import type { Contract } from "../types";
import { formatCurrency } from "../utils";
import { CreateContractDialog } from "./create-contract-dialog";

function daysToExpiry(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000);
}

export function ContractListPage() {
  const { data, isPending, isError, refetch } = useContracts();
  const [createOpen, setCreateOpen] = React.useState(false);

  const active = (data ?? []).filter((c) => c.status === "Active");
  const expiringSoon = (data ?? []).filter(
    (c) => c.status === "Active" && daysToExpiry(c.endDate) <= 90
  );
  const signing = (data ?? []).filter((c) =>
    ["Review", "Approval", "Signing"].includes(c.status)
  );
  const totalValue = (data ?? [])
    .filter((c) => c.status === "Active")
    .reduce((sum, c) => sum + c.value, 0);

  const columns = React.useMemo<ColumnDef<Contract>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Contract",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/procurement/contracts/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.title}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.ref} · {row.original.type}
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
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">
            {formatCurrency(row.original.value)}
          </span>
        ),
      },
      {
        accessorKey: "endDate",
        header: "Ends",
        cell: ({ row }) => {
          const days = daysToExpiry(row.original.endDate);
          return (
            <span className="whitespace-nowrap text-muted-foreground">
              {new Date(row.original.endDate).toLocaleDateString()}
              {row.original.status === "Active" && days <= 90 ? (
                <Badge
                  variant={days <= 30 ? "destructive" : "secondary"}
                  className="ml-2"
                >
                  {days <= 0 ? "Expiring" : `${days}d`}
                </Badge>
              ) : null}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <StatusBadge status={row.original.status} />
            {row.original.signed ? (
              <Badge variant="outline">Signed</Badge>
            ) : null}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link
              href={`/procurement/contracts/${row.original.id}`}
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
        <p className="text-destructive">Unable to load contracts.</p>
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
        <KpiCard
          label="Active contracts"
          value={active.length}
          icon={FileSignature}
        />
        <KpiCard
          label="Expiring ≤ 90 days"
          value={expiringSoon.length}
          icon={TimerReset}
          trendDirection="down"
        />
        <KpiCard
          label="Needing signing"
          value={signing.length}
          icon={FileSignature}
        />
        <KpiCard
          label="Active value"
          value={formatCurrency(totalValue)}
          icon={CircleDollarSign}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New contract
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="title"
        searchPlaceholder="Search contracts..."
        emptyTitle="No contracts"
        emptyDescription="Create your first contract to get started."
      />

      {createOpen ? (
        <CreateContractDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
