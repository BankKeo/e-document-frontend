"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  ArrowUpRight,
  Ban,
  FilePenLine,
  Plus,
  Send,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useRequisitions,
  useSetRequisitionStatus,
} from "../api/requisition.queries";
import type { PurchaseRequisition } from "../types";
import { formatCurrency } from "../utils";
import { CreateRequisitionDialog } from "./create-requisition-dialog";

export function RequisitionListPage() {
  const { data, isPending, isError, refetch } = useRequisitions();
  const [createOpen, setCreateOpen] = React.useState(false);

  const pending = (data ?? []).filter((pr) =>
    ["Submitted", "Department Approval", "Budget Approval"].includes(pr.status)
  );
  const approved = (data ?? []).filter((pr) => pr.status === "Approved");
  const totalValue = (data ?? []).reduce((sum, pr) => sum + pr.total, 0);

  const columns = React.useMemo<ColumnDef<PurchaseRequisition>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Requisition",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/procurement/requisitions/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.title}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.ref} · {row.original.department}
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
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.items.length}
          </span>
        ),
      },
      {
        accessorKey: "requester",
        header: "Requester",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.requester}
          </span>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">
            {formatCurrency(row.original.total)}
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
        cell: ({ row }) => <PrRowActions pr={row.original} />,
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load requisitions.</p>
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
        <KpiCard label="Awaiting approval" value={pending.length} icon={Send} />
        <KpiCard label="Approved" value={approved.length} icon={ThumbsUp} />
        <KpiCard
          label="Total value"
          value={formatCurrency(totalValue)}
          icon={ArrowUpRight}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New requisition
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="title"
        searchPlaceholder="Search requisitions..."
        emptyTitle="No requisitions"
        emptyDescription="Create your first purchase requisition to get started."
      />

      {createOpen ? (
        <CreateRequisitionDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function PrRowActions({ pr }: { pr: PurchaseRequisition }) {
  const setStatus = useSetRequisitionStatus();

  async function submit() {
    try {
      await setStatus.mutateAsync({
        id: pr.id,
        status: "Submitted",
        action: "Submitted for approval",
      });
      toast.success("Submitted (PR-008)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit.");
    }
  }

  async function approve() {
    try {
      const next =
        pr.status === "Submitted"
          ? {
              status: "Department Approval" as const,
              action: "Department approval",
            }
          : { status: "Approved" as const, action: "Approved by budget" };
      await setStatus.mutateAsync({ id: pr.id, ...next });
      toast.success("Approved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to approve."
      );
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-1">
      {pr.status === "Draft" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={submit}
          disabled={setStatus.isPending}
        >
          <Send /> Submit
        </Button>
      ) : null}
      {pr.status === "Submitted" || pr.status === "Department Approval" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={approve}
          disabled={setStatus.isPending}
        >
          <ThumbsUp /> Approve
        </Button>
      ) : null}
      {pr.status === "Submitted" ||
      pr.status === "Department Approval" ||
      pr.status === "Budget Approval" ? (
        <ConfirmDialog
          title="Return requisition?"
          description="Send it back to the requester for changes."
          confirmLabel="Return"
          onConfirm={() =>
            setStatus
              .mutateAsync({
                id: pr.id,
                status: "Returned",
                action: "Returned for changes",
              })
              .then(() => undefined)
          }
          trigger={
            <Button variant="ghost" size="sm">
              <FilePenLine />
            </Button>
          }
        />
      ) : null}
      {pr.status !== "Approved" &&
      pr.status !== "Cancelled" &&
      pr.status !== "Rejected" ? (
        <ConfirmDialog
          title="Cancel requisition?"
          description={`${pr.title} will be cancelled.`}
          confirmLabel="Cancel"
          onConfirm={() =>
            setStatus
              .mutateAsync({
                id: pr.id,
                status: "Cancelled",
                action: "Cancelled",
              })
              .then(() => undefined)
          }
          trigger={
            <Button variant="ghost" size="sm" className="text-destructive">
              <Ban />
            </Button>
          }
        />
      ) : null}
      <Link
        href={`/procurement/requisitions/${pr.id}`}
        className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
      >
        View
      </Link>
    </div>
  );
}
