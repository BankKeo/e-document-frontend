"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeletePosition, useDepartmentsQuery, usePositionsQuery } from "../api/organization.queries";
import type { Position } from "../types";
import { PositionFormDialog } from "./position-form-dialog";
import { EntityRowActions } from "./entity-row-actions";

function buildColumns(
  departmentNameOf: (id: string) => string,
  onEdit: (position: Position) => void,
  onDelete: (position: Position) => void
): ColumnDef<Position>[] {
  return [
    {
      accessorKey: "title",
      header: "Position",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "departmentId",
      header: "Department",
      cell: ({ row }) => <Badge variant="outline">{departmentNameOf(row.original.departmentId)}</Badge>,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => <Badge variant="secondary">{row.original.grade}</Badge>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="line-clamp-1 text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <EntityRowActions
            title="Delete position?"
            description={`Deleting "${row.original.title}" will not remove employees, but they'll need to be reassigned.`}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        </div>
      ),
    },
  ];
}

export function PositionsPage() {
  const { data, isPending, isError, error, refetch } = usePositionsQuery();
  const { data: departments } = useDepartmentsQuery();
  const deletePosition = useDeletePosition();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Position | null>(null);

  const departmentNames = React.useMemo(
    () => new Map((departments ?? []).map((entry) => [entry.id, entry.name])),
    [departments]
  );
  const departmentNameOf = (id: string) => departmentNames.get(id) ?? "—";

  const columns = React.useMemo(
    () => buildColumns(departmentNameOf, setEditing, (position) => deletePosition.mutateAsync(position.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departmentNames, deletePosition]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">{error instanceof Error ? error.message : "Unable to load positions."}</p>
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
        searchKey="title"
        searchPlaceholder="Search positions..."
        emptyTitle="No positions"
        emptyDescription="Add the first position to the organization."
        toolbar={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Add position
          </Button>
        }
      />

      <PositionFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <PositionFormDialog
          open={Boolean(editing)}
          position={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}