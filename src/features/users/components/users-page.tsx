"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { useUsers } from "@/features/users/api/user.queries";
import type { User } from "@/features/users/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { normalizeErrorMessage } from "@/lib/api/errors";
import { UserForm } from "@/features/users/components/user-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.createdAt}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status ?? "Active"} />,
  },
];

export function UsersPage() {
  const { data, isPending, isError, error, refetch } = useUsers({
    page: 1,
    limit: 100,
  });

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Unable to load users</AlertTitle>
        <AlertDescription>
          {normalizeErrorMessage(error)}{" "}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-8">
      <section className="max-w-xl" aria-labelledby="create-user-heading">
        <h2 id="create-user-heading" className="mb-3 text-base font-semibold">
          Create user
        </h2>
        <UserForm />
      </section>

      <section aria-labelledby="users-heading">
        <h2 id="users-heading" className="mb-3 text-base font-semibold">
          All users
        </h2>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isPending}
          searchKey="name"
          searchPlaceholder="Search users..."
          emptyTitle="No users yet"
          emptyDescription="Create your first user to get started."
        />
      </section>
    </div>
  );
}
