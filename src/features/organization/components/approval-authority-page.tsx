"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowRight, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useApprovalRulesQuery,
  useDeleteApprovalRule,
  useToggleApprovalRule,
} from "../api/organization.queries";
import type { ApprovalRule } from "../types";
import { ApprovalRuleFormDialog } from "./approval-rule-form-dialog";
import { EntityRowActions } from "./entity-row-actions";

const MODULE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  Procurement: "default",
  DMS: "secondary",
  Warehouse: "outline",
};

function formatLimit(rule: ApprovalRule): string {
  if (rule.limitKind === "any") return "Any amount";
  const formatter = new Intl.NumberFormat("en-US");
  const min = formatter.format(rule.minAmount ?? 0);
  const max = rule.maxAmount === undefined || rule.maxAmount === null
    ? "Unlimited"
    : formatter.format(rule.maxAmount);
  return `${min} – ${max} LAK`;
}

function StatusToggle({ rule }: { rule: ApprovalRule }) {
  const toggle = useToggleApprovalRule();

  async function handleToggle() {
    try {
      await toggle.mutateAsync({ id: rule.id, enabled: !rule.enabled });
      toast.success(rule.enabled ? "Rule disabled" : "Rule enabled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update rule.");
    }
  }

  return (
    <button type="button" onClick={handleToggle} className="flex items-center gap-2 group/toggle" aria-pressed={rule.enabled}>
      <StatusBadge status={rule.enabled ? "Active" : "Disabled"} />
      <span className="text-xs text-muted-foreground transition-colors group-hover/toggle:text-foreground group-hover/toggle:underline group-hover/toggle:underline-offset-4">
        {rule.enabled ? "Disable" : "Enable"}
      </span>
    </button>
  );
}

function buildColumns(
  onEdit: (rule: ApprovalRule) => void,
  onDelete: (rule: ApprovalRule) => void
): ColumnDef<ApprovalRule>[] {
  return [
    {
      accessorKey: "documentType",
      header: "Document type",
      cell: ({ row }) => <span className="font-medium">{row.original.documentType}</span>,
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => (
        <Badge variant={MODULE_VARIANTS[row.original.module] ?? "secondary"}>
          {row.original.module}
        </Badge>
      ),
    },
    {
      accessorKey: "limitKind",
      header: "Amount limit",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">{formatLimit(row.original)}</span>
      ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => <Badge variant="outline">Level {row.original.level}</Badge>,
    },
    {
      accessorKey: "approver",
      header: "Approval path",
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          {row.original.approver}
          <ArrowRight className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{row.original.alternateApprover}</span>
        </span>
      ),
    },
    {
      accessorKey: "enabled",
      header: "Status",
      cell: ({ row }) => <StatusToggle rule={row.original} />,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <EntityRowActions
            title="Delete approval rule?"
            description={`Removing the "${row.original.module}" rule for ${row.original.documentType} means documents may await approval with no authority assigned.`}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        </div>
      ),
    },
  ];
}

export function ApprovalAuthorityPage() {
  const { data, isPending, isError, error, refetch } = useApprovalRulesQuery();
  const deleteRule = useDeleteApprovalRule();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ApprovalRule | null>(null);

  const columns = React.useMemo(
    () => buildColumns(setEditing, (rule) => deleteRule.mutateAsync(rule.id)),
    [deleteRule]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">{error instanceof Error ? error.message : "Unable to load approval rules."}</p>
        <button type="button" onClick={() => refetch()} className="justify-self-start text-sm text-primary underline underline-offset-4">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="documentType"
        searchPlaceholder="Search rules..."
        emptyTitle="No approval rules"
        emptyDescription="Define who can approve each document type and amount."
        toolbar={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Add rule
          </Button>
        }
      />

      <ApprovalRuleFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <ApprovalRuleFormDialog
          open={Boolean(editing)}
          rule={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}