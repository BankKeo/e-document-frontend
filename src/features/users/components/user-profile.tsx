"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/auth-context";
import { useUser } from "../api/user.queries";

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
      <span className="min-w-0 text-right text-sm font-medium">{children}</span>
    </div>
  );
}

export function UserProfile() {
  const { user: authUser } = useAuth();
  const id = authUser?.id ?? "";
  const { data: record, isPending } = useUser(id);

  const displayName = record?.name ?? authUser?.name ?? "—";
  const email = record?.email ?? authUser?.email ?? "—";
  const roles = record?.role ?? authUser?.roles.join(", ");

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar size="lg">
            <AvatarFallback>{initials(displayName)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <h2 className="text-lg font-semibold tracking-tight">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{roles}</Badge>
              {record ? <Badge variant="outline">{record.department}</Badge> : null}
              {record ? <Badge>{record.status}</Badge> : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Your contact details.</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && !record ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading profile…
              </div>
            ) : (
              <dl className="divide-y">
                <DetailRow label="Email">
                  <span className="flex items-center justify-end gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground" />
                    {email}
                  </span>
                </DetailRow>
                <DetailRow label="Phone">
                  <span className="flex items-center justify-end gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    {record?.phone ?? "Not provided"}
                  </span>
                </DetailRow>
                <DetailRow label="Job title">{record?.title ?? "—"}</DetailRow>
              </dl>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Your role and department.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <DetailRow label="Department">
                <span className="flex items-center justify-end gap-1.5">
                  <Building2 className="size-3.5 text-muted-foreground" />
                  {record?.department ?? "—"}
                </span>
              </DetailRow>
              <DetailRow label="Role">
                <span className="flex items-center justify-end gap-1.5">
                  <ShieldCheck className="size-3.5 text-muted-foreground" />
                  {record?.role ?? authUser?.roles.join(", ")}
                </span>
              </DetailRow>
              <DetailRow label="Member since">
                {record
                  ? new Date(record.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })
                  : "—"}
              </DetailRow>
              <DetailRow label="Last active">
                {record?.lastActiveAt ?? "—"}
              </DetailRow>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/account/security" className={cn(buttonVariants({ variant: "default" }))}>
          Manage security settings
          <ArrowUpRight />
        </Link>
        <p className="text-xs text-muted-foreground">
          Role or department changes are handled by an administrator — contact
          your admin to request updates.
        </p>
      </div>
    </div>
  );
}