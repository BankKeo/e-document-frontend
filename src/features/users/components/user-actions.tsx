"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { User } from "../types";
import { useActivateUser, useDisableUser } from "../api/user.queries";

function ToggleUserStatus({
  user,
  size = "sm",
}: {
  user: User;
  size?: "default" | "sm";
}) {
  const disable = useDisableUser();
  const activate = useActivateUser();
  const disabled = user.status === "Disabled";
  const busy = disable.isPending || activate.isPending;

  async function toggle() {
    try {
      if (disabled) {
        await activate.mutateAsync(user.id);
        toast.success(`${user.name} activated`);
      } else {
        await disable.mutateAsync(user.id);
        toast.success(`${user.name} disabled`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return disabled ? (
    <Button size={size} onClick={toggle} disabled={busy}>
      {busy ? <CheckCircle2 className="animate-pulse" /> : <UserCheck />}
      Activate
    </Button>
  ) : (
    <ConfirmDialog
      title="Disable this user?"
      description={`${user.name} will lose access to the platform immediately and won't be able to sign in. Their data is preserved.`}
      confirmLabel="Disable user"
      onConfirm={toggle}
      trigger={
        <Button
          variant="outline"
          size={size}
          disabled={busy}
          aria-label={`Disable ${user.name}`}
        >
          <Ban />
          Disable
        </Button>
      }
    />
  );
}

export function UserRowActions({
  user,
  onEdit,
}: {
  user: User;
  onEdit: (user: User) => void;
}) {
  const disabled = user.status === "Disabled";
  const disable = useDisableUser();
  const activate = useActivateUser();
  const busy = disable.isPending || activate.isPending;

  async function toggle() {
    try {
      if (disabled) {
        await activate.mutateAsync(user.id);
        toast.success(`${user.name} activated`);
      } else {
        await disable.mutateAsync(user.id);
        toast.success(`${user.name} disabled`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="User actions" />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem render={<Link href={`/admin/users/${user.id}`} />}>
          <Eye />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {disabled ? (
          <DropdownMenuItem onClick={toggle} disabled={busy}>
            <UserCheck className="text-emerald-500" />
            Activate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              void toggle();
            }}
            disabled={busy}
          >
            <UserX />
            Disable
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ToggleUserStatus };