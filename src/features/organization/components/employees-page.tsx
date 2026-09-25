"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { useDeleteEmployee, useDepartmentsQuery, useEmployeesQuery, usePositionsQuery } from "../api/organization.queries";
import type { Employee, EmploymentStatus } from "../types";
import { EmployeeFormDialog } from "./employee-form-dialog";
import { EntityRowActions } from "./entity-row-actions";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function buildColumns(
  names: {
    department: (id: string) => string;
    position: (id: string) => string;
    employee: (id: string | null) => string;
  },
  onEdit: (employee: Employee) => void,
  onDelete: (employee: Employee) => void
): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "name",
      header: "Employee",
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">{initials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.employeeCode} · {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "departmentId",
      header: "Department",
      cell: ({ row }) => <Badge variant="outline">{names.department(row.original.departmentId)}</Badge>,
    },
    {
      accessorKey: "positionId",
      header: "Position",
      cell: ({ row }) => <span className="text-muted-foreground">{names.position(row.original.positionId)}</span>,
    },
    {
      accessorKey: "managerId",
      header: "Reports to",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.managerId ? names.employee(row.original.managerId) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "employmentType",
      header: "Type",
      cell: ({ row }) => <Badge variant="secondary">{row.original.employmentType}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <EntityRowActions
            title="Remove employee?"
            description={`Removing ${row.original.name} from the directory does not delete their user account.`}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        </div>
      ),
    },
  ];
}

export function EmployeesPage() {
  const { data, isPending, isError, error, refetch } = useEmployeesQuery();
  const { data: departments } = useDepartmentsQuery();
  const { data: positions } = usePositionsQuery();
  const deleteEmployee = useDeleteEmployee();
  const [status, setStatus] = React.useState<EmploymentStatus | "All">("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Employee | null>(null);

  const departmentNames = React.useMemo(
    () => new Map((departments ?? []).map((entry) => [entry.id, entry.name])),
    [departments]
  );
  const positionNames = React.useMemo(
    () => new Map((positions ?? []).map((entry) => [entry.id, entry.title])),
    [positions]
  );
  const employeeNames = React.useMemo(
    () => new Map((data ?? []).map((entry) => [entry.id, entry.name])),
    [data]
  );
  const names = React.useMemo(
    () => ({
      department: (id: string) => departmentNames.get(id) ?? "—",
      position: (id: string) => positionNames.get(id) ?? "—",
      employee: (id: string | null) => employeeNames.get(id ?? "") ?? "—",
    }),
    [departmentNames, positionNames, employeeNames]
  );

  const columns = React.useMemo(
    () =>
      buildColumns(
        names,
        setEditing,
        (employee) => deleteEmployee.mutateAsync(employee.id)
      ),
    [names, deleteEmployee]
  );

  const filtered = React.useMemo(() => {
    const employees = data ?? [];
    return status === "All" ? employees : employees.filter((entry) => entry.status === status);
  }, [data, status]);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">{error instanceof Error ? error.message : "Unable to load employees."}</p>
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
        data={filtered}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search employees..."
        emptyTitle="No employees found"
        emptyDescription="Try adjusting the status filter, or add an employee."
        toolbar={
          <>
            <Select value={status} onValueChange={(value) => setStatus(value as EmploymentStatus | "All")}>
              <SelectTrigger size="sm" className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus />
              Add employee
            </Button>
          </>
        }
      />

      <EmployeeFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <EmployeeFormDialog
          open={Boolean(editing)}
          employee={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}