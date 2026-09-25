"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Loader2,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import {
  useAssignDepartment,
  useAssignRole,
  useDepartments,
  useRoles,
  useUser,
} from "../api/user.queries";
import { UserFormDialog } from "./user-form-dialog";
import { ToggleUserStatus } from "./user-actions";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium text-foreground">
        {children}
      </span>
    </div>
  );
}

export function UserDetail({ id }: { id: string }) {
  const { data: user, isPending, isError, error, refetch } = useUser(id);
  const [editOpen, setEditOpen] = React.useState(false);
  const { data: roles } = useRoles();
  const { data: departments } = useDepartments();
  const assignRole = useAssignRole();
  const assignDepartment = useAssignDepartment();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading user…
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load user</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "User not found."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/admin/users"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Back to users
          </Link>
        </div>
      </div>
    );
  }

  const current = user;

  async function handleAssignRole(role: string) {
    try {
      await assignRole.mutateAsync({ id: current.id, role });
      toast.success(`Role assigned: ${role}`);
    } catch (assignError) {
      toast.error(
        assignError instanceof Error ? assignError.message : "Unable to assign role."
      );
    }
  }

  async function handleAssignDepartment(department: string) {
    try {
      await assignDepartment.mutateAsync({ id: current.id, department });
      toast.success(`Department assigned: ${department}`);
    } catch (assignError) {
      toast.error(
        assignError instanceof Error
          ? assignError.message
          : "Unable to assign department."
      );
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/admin/users"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to users
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">
                  {user.name}
                </h2>
                <StatusBadge status={user.status} />
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {user.title} · {user.department}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ToggleUserStatus user={user} />
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>How to reach this user.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <DetailRow label="Email">
                <span className="flex items-center justify-end gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  {user.email}
                </span>
              </DetailRow>
              <DetailRow label="Phone">
                <span className="flex items-center justify-end gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  {user.phone ?? "Not provided"}
                </span>
              </DetailRow>
              <DetailRow label="Job title">{user.title}</DetailRow>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access</CardTitle>
            <CardDescription>
              Role and department determine what this user can see and do.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <ShieldCheck className="size-4 text-muted-foreground" />
                Role
              </div>
              <Select
                value={current.role}
                onValueChange={(value) => {
                  if (value) void handleAssignRole(value);
                }}
              >
                <SelectTrigger className="w-full" aria-label="Assign role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Building2 className="size-4 text-muted-foreground" />
                Department
              </div>
              <Select
                value={current.department}
                onValueChange={(value) => {
                  if (value) void handleAssignDepartment(value);
                }}
              >
                <SelectTrigger className="w-full" aria-label="Assign department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">
                <UserRound />
                {user.department}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Membership and activity details.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="Created">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DetailRow>
            <DetailRow label="Last active">{user.lastActiveAt}</DetailRow>
            <DetailRow label="Status">
              <StatusBadge status={user.status} />
            </DetailRow>
          </dl>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-xs text-muted-foreground">
        User ID: {user.id} · Managed in the Administration module. For security
        settings such as sessions and MFA, direct users to their own{" "}
        <Link href="/account/security" className="text-primary underline underline-offset-4">
          Security
        </Link>{" "}
        page.
      </p>

      <UserFormDialog
        open={editOpen}
        user={user}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}