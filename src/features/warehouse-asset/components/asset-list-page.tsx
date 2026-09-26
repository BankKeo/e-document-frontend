"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Building2, Coins, Plus, Tag, Wrench } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAssets } from "../api/asset.queries";
import type { Asset } from "../types";
import { formatCurrency } from "../utils";
import { RegisterAssetDialog } from "./register-asset-dialog";

export function AssetListPage() {
  const { data, isPending, isError, refetch } = useAssets();
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const assigned = (data ?? []).filter((a) => a.status === "Assigned").length;
  const inMaintenance = (data ?? []).filter(
    (a) => a.status === "In Maintenance"
  );
  const bookValue = (data ?? []).reduce((sum, a) => sum + a.currentValue, 0);

  const columns = React.useMemo<ColumnDef<Asset>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Asset",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/warehouse/assets/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.tag} · {row.original.category}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "custodian",
        header: "Custodian (ASSET-005)",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.custodian}
          </span>
        ),
      },
      {
        accessorKey: "location",
        header: "Location (ASSET-004)",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.location}</span>
        ),
      },
      {
        accessorKey: "currentValue",
        header: "Book value",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">
            {formatCurrency(row.original.currentValue)}
          </span>
        ),
      },
      {
        accessorKey: "depreciationRate",
        header: "Depreciation",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {row.original.depreciationRate}%
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load assets.</p>
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
        <KpiCard label="Total assets" value={data?.length ?? 0} icon={Tag} />
        <KpiCard label="Assigned" value={assigned} icon={Building2} />
        <KpiCard
          label="In maintenance"
          value={inMaintenance.length}
          icon={Wrench}
        />
        <KpiCard
          label="Total book value"
          value={formatCurrency(bookValue)}
          icon={Coins}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setRegisterOpen(true)}>
          <Plus />
          Register asset
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search assets..."
        emptyTitle="No assets"
        emptyDescription="Register an asset to start tracking (ASSET-001)."
      />

      {registerOpen ? (
        <RegisterAssetDialog
          open
          onOpenChange={(open) => {
            if (!open) setRegisterOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
