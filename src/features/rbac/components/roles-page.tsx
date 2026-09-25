"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityRowActions } from "@/components/shared/entity-row-actions";
import { useDeleteRole, useRolesQuery } from "../api/rbac.queries";
import type { Role } from "../types";
import { RoleFormDialog } from "./role-form-dialog";

export function RolesPage() {
  const { data, isPending, isError, error, refetch } = useRolesQuery();
  const deleteRole = useDeleteRole();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Role | null>(null);

  const columns = React.useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Role",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/admin/roles/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-muted-foreground">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: "userCount",
        header: "Users",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {row.original.userCount}
          </span>
        ),
      },
      {
        accessorKey: "builtIn",
        header: "Type",
        cell: ({ row }) =>
          row.original.builtIn ? (
            <Badge variant="secondary">Built-in</Badge>
          ) : (
            <Badge variant="outline">Custom</Badge>
          ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <EntityRowActions
              title="Delete role?"
              description={`Removing "${row.original.name}" unassigns it from users.`}
              canDelete={!row.original.builtIn}
              onEdit={() => setEditing(row.original)}
              onDelete={() => deleteRole.mutateAsync(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [deleteRole]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Unable to load roles."}
        </p>
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
        data={data ?? []}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search roles..."
        emptyTitle="No roles"
        emptyDescription="Create the first role to start configuring access."
        toolbar={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Create role
          </Button>
        }
      />

      <RoleFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <RoleFormDialog
          open={Boolean(editing)}
          role={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}