"use client";

import * as React from "react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { PERMISSION_MODULES } from "../mock/data";
import { usePermissionsQuery, useTogglePermission } from "../api/rbac.queries";
import type { Permission, PermissionModule } from "../types";

const MODULE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  DMS: "default",
  Procurement: "secondary",
  Warehouse: "outline",
  Administration: "secondary",
};

function PermissionToggle({ permission }: { permission: Permission }) {
  const toggle = useTogglePermission();

  async function handleToggle() {
    try {
      await toggle.mutateAsync({ id: permission.id, enabled: !permission.enabled });
      toast.success(permission.enabled ? "Permission disabled" : "Permission enabled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update permission.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="group/toggle relative flex h-5 w-8 items-center rounded-full border transition-colors aria-pressed:bg-primary/80 aria-pressed:border-primary data-[enabled=false]:bg-muted"
      aria-pressed={permission.enabled}
      data-enabled={permission.enabled}
    >
      <span
        className="size-3.5 rounded-full bg-muted-foreground/40 transition-transform group-aria-pressed/toggle:translate-x-3 group-aria-pressed/toggle:bg-primary-foreground group-data-[enabled=false]/toggle:ml-1"
      />
      <span className="sr-only">{permission.enabled ? "Enabled" : "Disabled"}</span>
    </button>
  );
}

const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "label",
    header: "Permission",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-medium">{row.original.label}</p>
        <p className="font-mono text-xs text-muted-foreground">{row.original.id}</p>
      </div>
    ),
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-muted-foreground">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "enabled",
    header: "Availability",
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <StatusBadge status={row.original.enabled ? "Active" : "Disabled"} />
        <PermissionToggle permission={row.original} />
      </span>
    ),
  },
];

export function PermissionsPage() {
  const { data, isPending, isError, error, refetch } = usePermissionsQuery();
  const [module, setModule] = React.useState<PermissionModule | "All">("All");

  const filtered = React.useMemo(() => {
    const permissions = data ?? [];
    return module === "All"
      ? permissions
      : permissions.filter((permission) => permission.module === module);
  }, [data, module]);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Unable to load permissions."}
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
      <p className="max-w-2xl text-sm text-muted-foreground">
        Permissions are defined by the platform and granted to roles. Toggle a
        permission off to stop it being assignable until it is re-enabled.
      </p>
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isPending}
        searchKey="label"
        searchPlaceholder="Search permissions..."
        emptyTitle="No permissions"
        emptyDescription="No permissions match the current filter."
        toolbar={
          <Select
            value={module}
            onValueChange={(value) => setModule(value as PermissionModule | "All")}
          >
            <SelectTrigger size="sm" className="w-44" aria-label="Filter by module">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All modules</SelectItem>
              {PERMISSION_MODULES.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}