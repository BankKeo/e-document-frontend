"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Plus, ShieldAlert, Truck, UserPlus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useSuppliers } from "../api/supplier.queries";
import type { Supplier } from "../types";
import { RegisterSupplierDialog } from "./register-supplier-dialog";

export function SupplierListPage() {
  const { data, isPending, isError, refetch } = useSuppliers();
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const active = (data ?? []).filter((s) => s.status === "Active");
  const approvals = (data ?? []).filter((s) =>
    ["Submitted", "Under Review", "Verified", "Approved"].includes(s.status)
  );
  const flagged = (data ?? []).filter((s) => s.hazard > 0);

  const columns = React.useMemo<ColumnDef<Supplier>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Supplier",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/procurement/suppliers/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.ref} · {row.original.taxId}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "categories",
        header: "Categories",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
            {row.original.categories.length > 2 ? (
              <Badge variant="secondary">
                +{row.original.categories.length - 2}
              </Badge>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.country}</span>
        ),
      },
      {
        accessorKey: "evaluation",
        header: "Rating",
        cell: ({ row }) => {
          const evaluation = row.original.evaluation;
          return evaluation ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-sm tabular-nums">
              {evaluation.score.toFixed(1)}
              <span className="text-xs text-muted-foreground">
                ({evaluation.rating})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <StatusBadge status={row.original.status} />
            {row.original.hazard > 0 ? (
              <span title={`${row.original.hazard} flags`}>
                <ShieldAlert className="size-3.5 text-amber-600" />
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load suppliers.</p>
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
        <KpiCard label="Active suppliers" value={active.length} icon={Truck} />
        <KpiCard
          label="Pending approval"
          value={approvals.length}
          icon={UserPlus}
        />
        <KpiCard
          label="Flagged (hazard)"
          value={flagged.length}
          icon={ShieldAlert}
          trendDirection="down"
        />
        <KpiCard
          label="Total suppliers"
          value={data?.length ?? 0}
          icon={Truck}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setRegisterOpen(true)}>
          <Plus />
          Register supplier
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search suppliers..."
        emptyTitle="No suppliers"
        emptyDescription="Register a supplier to get started."
      />

      {registerOpen ? (
        <RegisterSupplierDialog
          key="register"
          onOpenChange={(open) => {
            if (!open) setRegisterOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
