"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, UserPlus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { normalizeErrorMessage } from "@/lib/api/errors";
import { useUsers } from "../api/user.queries";
import type { User, UserStatus } from "../types";
import { UserRowActions } from "./user-actions";
import { UserFormDialog } from "./user-form-dialog";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function buildColumns(onEdit: (user: User) => void): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">
              {initials(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link
              href={`/admin/users/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.department}</Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last active",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.lastActiveAt}</span>
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
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UserRowActions user={row.original} onEdit={onEdit} />
        </div>
      ),
    },
  ];
}

export function UsersPage() {
  const { data, isPending, isError, error, refetch } = useUsers();
  const [status, setStatus] = React.useState<UserStatus | "All">("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<User | null>(null);

  const columns = React.useMemo(() => buildColumns(setEditing), []);

  const filtered = React.useMemo(() => {
    const users = data ?? [];
    return status === "All"
      ? users
      : users.filter((user) => user.status === status);
  }, [data, status]);

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
    <div className="grid gap-4">
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search users..."
        emptyTitle="No users found"
        emptyDescription="Try adjusting the status filter, or add a new user."
        toolbar={
          <>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as UserStatus | "All")}
            >
              <SelectTrigger size="sm" className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <UserPlus />
              Add user
            </Button>
          </>
        }
      />

      <UserFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <UserFormDialog
          open={Boolean(editing)}
          user={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}