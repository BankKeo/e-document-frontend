"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Ban, Gavel, Loader2, Plus, Rocket, Users } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useCancelTender,
  usePublishTender,
  useTenders,
} from "../api/tender.queries";
import type { Tender } from "../types";
import { formatCurrency } from "../utils";
import { CreateTenderDialog } from "./create-tender-dialog";

export function TenderListPage() {
  const { data, isPending, isError, refetch } = useTenders();
  const [createOpen, setCreateOpen] = React.useState(false);

  const openBids = (data ?? []).filter(
    (t) => t.status === "Open for Bids"
  ).length;
  const evaluating = (data ?? []).filter(
    (t) => t.status === "Under Evaluation" || t.status === "Bids Closed"
  ).length;
  const awarded = (data ?? []).filter((t) => t.status === "Awarded").length;
  const totalBids = (data ?? []).reduce((sum, t) => sum + t.bids.length, 0);

  const columns = React.useMemo<ColumnDef<Tender>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Tender",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/procurement/tenders/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.title}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.ref}
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
        accessorKey: "estimatedValue",
        header: "Est. value",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {formatCurrency(row.original.estimatedValue)}
          </span>
        ),
      },
      {
        accessorKey: "bids",
        header: "Bids",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Gavel className="size-3.5" />
            {row.original.bids.length}
          </span>
        ),
      },
      {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.owner}</span>
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
        cell: ({ row }) => <TenderRowActions tender={row.original} />,
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load tenders.</p>
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
        <KpiCard label="Open for bids" value={openBids} icon={Rocket} />
        <KpiCard label="Evaluating" value={evaluating} icon={Users} />
        <KpiCard label="Awarded" value={awarded} icon={Gavel} />
        <KpiCard label="Total bids" value={totalBids} icon={Gavel} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New tender
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="title"
        searchPlaceholder="Search tenders..."
        emptyTitle="No tenders"
        emptyDescription="Create your first tender to get started."
      />

      {createOpen ? (
        <CreateTenderDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function TenderRowActions({ tender }: { tender: Tender }) {
  const publish = usePublishTender();
  const cancel = useCancelTender();

  return (
    <div className="flex flex-wrap justify-end gap-1">
      {tender.status === "Draft" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => void publish.mutateAsync(tender.id)}
          disabled={publish.isPending}
        >
          {publish.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Rocket />
          )}
          Publish
        </Button>
      ) : null}
      {(tender.status === "Open for Bids" || tender.status === "Bids Closed") &&
      tender.bids.length > 0 ? (
        <Link
          href={`/procurement/tenders/${tender.id}`}
          className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
        >
          Evaluate
        </Link>
      ) : null}
      {tender.status !== "Awarded" && tender.status !== "Cancelled" ? (
        <ConfirmDialog
          title="Cancel tender?"
          description={`${tender.title} will be cancelled.`}
          confirmLabel="Cancel tender"
          onConfirm={() => cancel.mutateAsync(tender.id).then(() => undefined)}
          trigger={
            <Button variant="ghost" size="sm" className="text-destructive">
              <Ban />
            </Button>
          }
        />
      ) : null}
      <Link
        href={`/procurement/tenders/${tender.id}`}
        className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
      >
        View
      </Link>
    </div>
  );
}
