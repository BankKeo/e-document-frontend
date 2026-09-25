"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, UserCog } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAssignUserRoles,
  useRolesQuery,
  useRbacUsers,
  useUserRolesQuery,
} from "../api/rbac.queries";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface WithRoles {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
}

function AssignRolesDialog({
  user,
  onOpenChange,
}: {
  user: WithRoles;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: roles } = useRolesQuery();
  const assign = useAssignUserRoles();
  const [selected, setSelected] = React.useState<Set<string>>(
    () => new Set(user.roleIds)
  );

  function toggle(roleId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  }

  async function save() {
    try {
      await assign.mutateAsync({ userId: user.id, roleIds: [...selected] });
      toast.success(`Roles updated for ${user.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to assign roles.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign roles</DialogTitle>
          <DialogDescription>
            {user.name} — roles determine permissions, department access, and
            data level.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-2">
          {roles?.map((role) => (
            <li key={role.id}>
              <Label
                htmlFor={`role-${role.id}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-2.5"
              >
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selected.has(role.id)}
                  onCheckedChange={() => toggle(role.id)}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{role.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </Label>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assign.isPending}>
            Cancel
          </Button>
          <Button onClick={save} disabled={assign.isPending}>
            {assign.isPending && <Loader2 className="animate-spin" />}
            Save roles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserRolesPage() {
  const { data: users } = useRbacUsers();
  const { data: assignments } = useUserRolesQuery();
  const { data: roles } = useRolesQuery();
  const [assigning, setAssigning] = React.useState<WithRoles | null>(null);

  const roleNames = React.useMemo(
    () => new Map((roles ?? []).map((role) => [role.id, role.name])),
    [roles]
  );

  const rows: WithRoles[] = React.useMemo(
    () =>
      (users ?? []).map((user) => ({
        ...user,
        roleIds:
          assignments?.find((assignment) => assignment.userId === user.id)
            ?.roleIds ?? [],
      })),
    [users, assignments]
  );

  const columns = React.useMemo<ColumnDef<WithRoles>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.original.name}</p>
              <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "roleIds",
        header: "Assigned roles",
        cell: ({ row }) => (
          <span className="flex flex-wrap gap-1.5">
            {row.original.roleIds.length === 0 ? (
              <span className="text-sm text-muted-foreground">No roles</span>
            ) : (
              row.original.roleIds.map((roleId) => (
                <Badge key={roleId} variant="secondary">
                  {roleNames.get(roleId) ?? roleId}
                </Badge>
              ))
            )}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setAssigning(row.original)}>
              <UserCog />
              Assign roles
            </Button>
          </div>
        ),
      },
    ],
    [roleNames]
  );

  return (
    <div className="grid gap-4">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Assign one or more roles to each user. A user&apos;s effective access is
        the union of their roles.
      </p>
      <DataTable
        columns={columns}
        data={rows}
        searchKey="name"
        searchPlaceholder="Search users..."
        emptyTitle="No users"
        emptyDescription="No users are available yet."
      />

      {assigning ? (
        <AssignRolesDialog
          key={assigning.id}
          user={assigning}
          onOpenChange={(open) => !open && setAssigning(null)}
        />
      ) : null}
    </div>
  );
}