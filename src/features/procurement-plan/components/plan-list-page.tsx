"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  CalendarDays,
  CircleDollarSign,
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
import { usePlans, useSetPlanStatus } from "../api/plan.queries";
import type { ProcurementPlan } from "../types";
import { formatCurrency } from "../utils";
import { CreatePlanDialog } from "./create-plan-dialog";

export function PlanListPage() {
  const { data, isPending, isError, refetch } = usePlans();
  const setStatus = useSetPlanStatus();
  const [createOpen, setCreateOpen] = React.useState(false);

  const approved = (data ?? []).filter(
    (p) => p.status === "Approved" || p.status === "In Progress"
  );
  const totalBudget = (data ?? []).reduce((sum, p) => sum + p.budget, 0);
  const totalEstimated = (data ?? []).reduce(
    (sum, p) => sum + p.estimatedCost,
    0
  );
  const pending = (data ?? []).filter(
    (p) => p.status === "Draft" || p.status === "Submitted"
  ).length;

  const columns = React.useMemo<ColumnDef<ProcurementPlan>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Plan",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/procurement/plans/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.title}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.ref} · FY {row.original.fiscalYear}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.department}
          </span>
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
        accessorKey: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">
            {formatCurrency(row.original.budget)}
          </span>
        ),
      },
      {
        accessorKey: "estimatedCost",
        header: "Est. cost",
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {formatCurrency(row.original.estimatedCost)}
          </span>
        ),
      },
      {
        accessorKey: "plannedDate",
        header: "Planned date",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.plannedDate).toLocaleDateString()}
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
        cell: ({ row }) => {
          const plan = row.original;
          return (
            <div className="flex flex-wrap justify-end gap-1">
              {plan.status === "Draft" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void submitPlan(plan.id, setStatus)}
                  disabled={setStatus.isPending}
                >
                  <Send />
                  Submit
                </Button>
              ) : null}
              {plan.status === "Submitted" ? (
                <Button
                  size="sm"
                  onClick={() => void approvePlan(plan.id, setStatus)}
                  disabled={setStatus.isPending}
                >
                  <ThumbsUp />
                  Approve
                </Button>
              ) : null}
              <Link
                href={`/procurement/plans/${plan.id}`}
                className="inline-flex h-7 items-center rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
              >
                View
              </Link>
            </div>
          );
        },
      },
    ];
  }, [setStatus]);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load procurement plans.</p>
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
          label="Approved / in progress"
          value={approved.length}
          icon={CalendarDays}
        />
        <KpiCard
          label="Total budget"
          value={formatCurrency(totalBudget)}
          icon={CircleDollarSign}
        />
        <KpiCard
          label="Estimated spend"
          value={formatCurrency(totalEstimated)}
          icon={CircleDollarSign}
        />
        <KpiCard label="Pending approval" value={pending} icon={Send} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New plan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="title"
        searchPlaceholder="Search plans..."
        emptyTitle="No procurement plans"
        emptyDescription="Create your first procurement plan to get started."
      />

      {createOpen ? (
        <CreatePlanDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

async function submitPlan(
  id: string,
  setStatus: ReturnType<typeof useSetPlanStatus>
) {
  try {
    await setStatus.mutateAsync({ id, status: "Submitted" });
    toast.success("Plan submitted (PLAN-008)");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Unable to submit.");
  }
}

async function approvePlan(
  id: string,
  setStatus: ReturnType<typeof useSetPlanStatus>
) {
  try {
    await setStatus.mutateAsync({ id, status: "Approved" });
    toast.success("Plan approved");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Unable to approve.");
  }
}
