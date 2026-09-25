"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Eye,
  Loader2,
  Pencil,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useDataAccess,
  useDepartmentScope,
  usePermissionsQuery,
  useRbacDepartments,
  useRolePermissions,
  useRolesQuery,
  useSaveDataAccess,
  useSaveDepartmentScope,
  useSaveRolePermissions,
} from "../api/rbac.queries";
import { DATA_LEVELS } from "../mock/data";
import type { DataLevel } from "../types";
import { RoleFormDialog } from "./role-form-dialog";

function PermissionRow({
  id,
  label,
  description,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <Label htmlFor={`perm-${id}`} className="flex cursor-pointer items-center gap-3 rounded-lg border p-2.5">
        <Checkbox id={`perm-${id}`} checked={checked} onCheckedChange={onToggle} />
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </Label>
    </li>
  );
}

function RolePermissionsTab({ roleId }: { roleId: string }) {
  const { data: permissions } = usePermissionsQuery();
  const { data: assigned } = useRolePermissions(roleId);
  const save = useSaveRolePermissions(roleId);
  const [local, setLocal] = React.useState<string[] | null>(null);

  if (!permissions || !assigned) {
    return <LoadingRow />;
  }

  const current = local ?? assigned;
  const selected = new Set(current);
  const modules = Array.from(new Set(permissions.map((entry) => entry.module)));

  function toggle(permissionId: string) {
    const next = new Set(local ?? assigned);
    if (next.has(permissionId)) next.delete(permissionId);
    else next.add(permissionId);
    setLocal([...next]);
  }

  async function handleSave() {
    if (!local) return;
    try {
      await save.mutateAsync(local);
      setLocal(null);
      toast.success("Permissions updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save permissions.");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <section key={module} className="grid gap-2">
            <h3 className="text-sm font-medium">{module}</h3>
            <ul className="grid gap-2">
              {permissions
                .filter((permission) => permission.module === module)
                .map((permission) =>
                  permission.enabled ? (
                    <PermissionRow
                      key={permission.id}
                      id={permission.id}
                      label={permission.label}
                      description={permission.description}
                      checked={selected.has(permission.id)}
                      onToggle={() => toggle(permission.id)}
                    />
                  ) : null
                )}
            </ul>
          </section>
        ))}
      </div>
      <div>
        <Button onClick={handleSave} disabled={local === null || save.isPending}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Save permissions
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          {local === null
            ? "No unsaved changes."
            : `${local.length} permission${local.length === 1 ? "" : "s"} selected.`}
        </p>
      </div>
    </div>
  );
}

function RoleDepartmentTab({ roleId }: { roleId: string }) {
  const { data: scope } = useDepartmentScope(roleId);
  const { data: departments } = useRbacDepartments();
  const save = useSaveDepartmentScope(roleId);
  const [local, setLocal] = React.useState<{
    allDepartments: boolean;
    departmentIds: string[];
  } | null>(null);

  if (!scope || !departments) {
    return <LoadingRow />;
  }

  const current = local ?? scope;
  const deptList = departments;

  function toggleAll() {
    setLocal({
      allDepartments: !current.allDepartments,
      departmentIds: current.allDepartments ? [] : deptList.map((entry) => entry.id),
    });
  }

  function toggleDepartment(departmentId: string) {
    const set = new Set(current.departmentIds);
    if (set.has(departmentId)) set.delete(departmentId);
    else set.add(departmentId);
    setLocal({ allDepartments: false, departmentIds: [...set] });
  }

  async function handleSave() {
    if (!local) return;
    try {
      await save.mutateAsync(local);
      setLocal(null);
      toast.success("Department access updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <div className="grid max-w-xl gap-4">
      <Label className="justify-self-start gap-2">
        <Checkbox checked={current.allDepartments} onCheckedChange={toggleAll} />
        Access to all departments
      </Label>

      {!current.allDepartments ? (
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">Restrict access to:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {departments.map((department) => (
              <li key={department.id}>
                <Label
                  htmlFor={`dept-${department.id}`}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5"
                >
                  <Checkbox
                    id={`dept-${department.id}`}
                    checked={current.departmentIds.includes(department.id)}
                    onCheckedChange={() => toggleDepartment(department.id)}
                  />
                  <Building2 className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{department.name}</span>
                </Label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <Button onClick={handleSave} disabled={local === null || save.isPending}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Save department access
        </Button>
      </div>
    </div>
  );
}

function RoleDataLevelTab({ roleId }: { roleId: string }) {
  const { data: settings } = useDataAccess(roleId);
  const save = useSaveDataAccess(roleId);
  const [local, setLocal] = React.useState<{
    level: DataLevel;
    sensitiveDocuments: boolean;
  } | null>(null);

  if (!settings) {
    return <LoadingRow />;
  }

  const current = local ?? settings;

  function setLevel(level: DataLevel) {
    setLocal({ level, sensitiveDocuments: current.sensitiveDocuments });
  }

  async function handleSave() {
    if (!local) return;
    try {
      await save.mutateAsync(local);
      setLocal(null);
      toast.success("Data level updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <div className="grid max-w-xl gap-4">
      <div className="grid gap-2">
        {DATA_LEVELS.map((option) => (
          <Label
            key={option.value}
            htmlFor={`level-${option.value}`}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-2.5"
          >
            <Checkbox
              id={`level-${option.value}`}
              checked={current.level === option.value}
              onCheckedChange={() => setLevel(option.value)}
            />
            <div className="grid gap-0.5">
              <p className="text-sm font-medium">{option.value}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </Label>
        ))}
      </div>

      <Label htmlFor="sensitive" className="justify-self-start gap-2">
        <Checkbox
          id="sensitive"
          checked={current.sensitiveDocuments}
          onCheckedChange={(checked) =>
            setLocal({ level: current.level, sensitiveDocuments: Boolean(checked) })
          }
        />
        <ShieldCheck className="size-4 text-muted-foreground" />
        Restrict sensitive documents
      </Label>

      <div>
        <Button onClick={handleSave} disabled={local === null || save.isPending}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Save data level
        </Button>
      </div>
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Loading…
    </div>
  );
}

export function RoleDetail({ id }: { id: string }) {
  const { data: roles } = useRolesQuery();
  const [editOpen, setEditOpen] = React.useState(false);

  const role = roles?.find((entry) => entry.id === id);

  if (!roles) {
    return <LoadingRow />;
  }

  if (!role) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Role not found</p>
        <Link
          href="/admin/roles"
          className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to roles
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/admin/roles"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to roles
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">{role.name}</h2>
              {role.builtIn ? (
                <Badge variant="secondary">Built-in</Badge>
              ) : (
                <Badge variant="outline">Custom</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {role.code} · {role.userCount} user{role.userCount === 1 ? "" : "s"} assigned
            </p>
            <p className="max-w-2xl text-sm text-muted-foreground">{role.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/admin/roles/users"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-transparent px-2.5 text-sm font-medium hover:bg-muted"
            >
              <Eye />
              Assigned users
            </Link>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="permissions">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="departments">Department access</TabsTrigger>
          <TabsTrigger value="datalevel">Data level</TabsTrigger>
        </TabsList>
        <TabsContent value="permissions" className="pt-4">
          <RolePermissionsTab roleId={id} />
        </TabsContent>
        <TabsContent value="departments" className="pt-4">
          <RoleDepartmentTab roleId={id} />
        </TabsContent>
        <TabsContent value="datalevel" className="pt-4">
          <RoleDataLevelTab roleId={id} />
        </TabsContent>
      </Tabs>

      <RoleFormDialog open={editOpen} role={role} onOpenChange={setEditOpen} />
    </div>
  );
}