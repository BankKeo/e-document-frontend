"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteDepartment, useDepartmentsQuery, useEmployeesQuery } from "../api/organization.queries";
import type { Department } from "../types";
import { DepartmentFormDialog } from "./department-form-dialog";
import { EntityRowActions } from "@/components/shared/entity-row-actions";

function buildColumns(
  nameOf: (id: string | null) => string,
  onEdit: (department: Department) => void,
  onDelete: (department: Department) => void
): ColumnDef<Department>[] {
  return [
    {
      accessorKey: "name",
      header: "Department",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="text-sm font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.code}</p>
        </div>
      ),
    },
    {
      accessorKey: "parentId",
      header: "Parent",
      cell: ({ row }) =>
        row.original.parentId ? (
          <span className="text-muted-foreground">
            {nameOf(row.original.parentId)}
          </span>
        ) : (
          <Badge variant="outline">Top level</Badge>
        ),
    },
    {
      accessorKey: "managerId",
      header: "Head of department",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.managerId ? nameOf(row.original.managerId) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "memberCount",
      header: "Members",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.memberCount}
        </span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <EntityRowActions
            title="Delete department?"
            description={`Deleting "${row.original.name}" does not remove its employees, but they'll need to be reassigned.`}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        </div>
      ),
    },
  ];
}

export function DepartmentsPage() {
  const { data, isPending, isError, error, refetch } = useDepartmentsQuery();
  const { data: employees } = useEmployeesQuery();
  const deleteDepartment = useDeleteDepartment();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Department | null>(null);

  const employeeNames = React.useMemo(
    () => new Map((employees ?? []).map((entry) => [entry.id, entry.name])),
    [employees]
  );
  const departmentNames = React.useMemo(
    () => new Map((data ?? []).map((entry) => [entry.id, entry.name])),
    [data]
  );
  const nameOf = (id: string | null) => employeeNames.get(id ?? "") ?? departmentNames.get(id ?? "") ?? "—";

  const columns = React.useMemo(
    () => buildColumns(nameOf, setEditing, (department) => deleteDepartment.mutateAsync(department.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nameOf, deleteDepartment, departmentNames, employeeNames]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">{error instanceof Error ? error.message : "Unable to load departments."}</p>
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
        searchKey="name"
        searchPlaceholder="Search departments..."
        emptyTitle="No departments"
        emptyDescription="Add the first department to structure the organization."
        toolbar={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Add department
          </Button>
        }
      />

      <DepartmentFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <DepartmentFormDialog
          open={Boolean(editing)}
          department={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}