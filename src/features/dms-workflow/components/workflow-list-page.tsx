"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  GitBranch,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Rocket,
  Trash2,
  Upload,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useCreateWorkflowVersion,
  useDeleteWorkflow,
  usePublishWorkflow,
  useWorkflows,
} from "../api/workflow.queries";
import type { WorkflowDefinition, WorkflowStatus } from "../types";
import { WorkflowFormDialog } from "./workflow-form-dialog";

function WorkflowRowActions({
  workflow,
  onEdit,
  onVersion,
}: {
  workflow: WorkflowDefinition;
  onEdit: (workflow: WorkflowDefinition) => void;
  onVersion: (workflow: WorkflowDefinition) => void;
}) {
  const publish = usePublishWorkflow();
  const deleteWorkflow = useDeleteWorkflow();
  const published = workflow.status === "Published";
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Workflow actions" />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onVersion(workflow)}>
            <Upload />
            Version
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(workflow)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => void publish.mutateAsync(workflow.id)}
            disabled={publish.isPending}
          >
            {publish.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Rocket />
            )}
            {published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete workflow?"
        description={`${workflow.name} will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => deleteWorkflow.mutateAsync(workflow.id)}
      />
    </>
  );
}

export function WorkflowListPage() {
  const { data, isPending, isError, refetch } = useWorkflows();
  const [status, setStatus] = React.useState<WorkflowStatus | "All">("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<WorkflowDefinition | null>(null);
  const [versioning, setVersioning] = React.useState<WorkflowDefinition | null>(
    null
  );

  const filtered = React.useMemo(() => {
    const workflows = data ?? [];
    return status === "All"
      ? workflows
      : workflows.filter((workflow) => workflow.status === status);
  }, [data, status]);

  const columns = React.useMemo<ColumnDef<WorkflowDefinition>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Workflow",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/dms/workflows/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.description}
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
        accessorKey: "version",
        header: "Version",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.version}</span>
        ),
      },
      {
        accessorKey: "nodes",
        header: "Nodes",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <GitBranch className="size-3.5" />
            {row.original.nodes.length}
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
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <WorkflowRowActions
            workflow={row.original}
            onEdit={setEditing}
            onVersion={setVersioning}
          />
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load workflows.</p>
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
    <div className="grid gap-4">
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search workflows..."
        emptyTitle={status === "All" ? "No workflows" : "No matching workflows"}
        emptyDescription={
          status === "All"
            ? "Create your first workflow definition to get started."
            : "Try adjusting the status filter, or add a new workflow."
        }
        toolbar={
          <>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as WorkflowStatus | "All")
              }
            >
              <SelectTrigger
                size="sm"
                className="w-36"
                aria-label="Filter by status"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus />
              New workflow
            </Button>
          </>
        }
      />

      <WorkflowFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <WorkflowFormDialog
          open={Boolean(editing)}
          workflow={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
      {versioning ? (
        <VersionWorkflowDialog
          key={versioning.id}
          workflow={versioning}
          onOpenChange={(open) => {
            if (!open) setVersioning(null);
          }}
        />
      ) : null}
    </div>
  );
}

function VersionWorkflowDialog({
  workflow,
  onOpenChange,
}: {
  workflow: WorkflowDefinition;
  onOpenChange: (open: boolean) => void;
}) {
  const createVersion = useCreateWorkflowVersion();
  const [summary, setSummary] = React.useState("");
  return (
    <div className="grid gap-4 rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">New version snapshot</p>
        <p className="text-xs text-muted-foreground">
          Bump {workflow.version} to the next minor version and record a change
          note.
        </p>
      </div>
      <label htmlFor="wf-version-summary" className="text-sm font-medium">
        Change note
      </label>
      <textarea
        id="wf-version-summary"
        rows={2}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={createVersion.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={() =>
            void createVersion.mutateAsync({ id: workflow.id, summary })
          }
          disabled={createVersion.isPending}
        >
          {createVersion.isPending && <Loader2 className="animate-spin" />}
          Create snapshot
        </Button>
      </div>
    </div>
  );
}
