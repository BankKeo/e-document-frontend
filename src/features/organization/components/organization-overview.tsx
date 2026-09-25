"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import {
  Building2,
  Briefcase,
  Landmark,
  Loader2,
  Pencil,
  Scale,
  Users,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/features/auth/components/form-field";
import {
  organizationSchema,
  type OrganizationInput,
} from "../schemas/organization.schemas";
import {
  useOrgStats,
  useOrganization,
  useUpdateOrganization,
} from "../api/organization.queries";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-baseline gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}

function OrgProfileCard() {
  const { data: org, isPending } = useOrganization();
  const updateOrg = useUpdateOrganization();
  const [editing, setEditing] = React.useState(false);

  const form = useForm<OrganizationInput>({
    resolver: zodResolver(organizationSchema) as Resolver<OrganizationInput>,
    defaultValues: {} as OrganizationInput,
  });

  React.useEffect(() => {
    if (org && !org.id) return;
    if (org) {
      form.reset({
        name: org.name,
        code: org.code,
        sector: org.sector,
        establishedYear: org.establishedYear,
        address: org.address,
        phone: org.phone,
        email: org.email,
        taxId: org.taxId,
        motto: org.motto,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  async function onSubmit(input: OrganizationInput) {
    try {
      await updateOrg.mutateAsync(input);
      toast.success("Organization profile updated");
      setEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization profile</CardTitle>
        <CardDescription>
          Entity details shown across the platform on documents and reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending || !org ? (
          <div className="grid gap-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : editing ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="name" label="Organization name" error={form.formState.errors.name?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} {...fieldProps} {...form.register("name")} />
                )}
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="code" label="Code" error={form.formState.errors.code?.message}>
                  {({ id, ...fieldProps }) => (
                    <Input id={id} {...fieldProps} {...form.register("code")} />
                  )}
                </FormField>
                <FormField id="establishedYear" label="Established" error={form.formState.errors.establishedYear?.message}>
                  {({ id, ...fieldProps }) => (
                    <Input id={id} type="number" {...fieldProps} {...form.register("establishedYear")} />
                  )}
                </FormField>
              </div>
            </div>

            <FormField id="sector" label="Sector" error={form.formState.errors.sector?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} {...fieldProps} {...form.register("sector")} />
              )}
            </FormField>
            <FormField id="address" label="Headquarters" error={form.formState.errors.address?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} {...fieldProps} {...form.register("address")} />
              )}
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="phone" label="Phone" error={form.formState.errors.phone?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} {...fieldProps} {...form.register("phone")} />
                )}
              </FormField>
              <FormField id="email" label="Email" error={form.formState.errors.email?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} type="email" {...fieldProps} {...form.register("email")} />
                )}
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="taxId" label="Tax ID" error={form.formState.errors.taxId?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} {...fieldProps} {...form.register("taxId")} />
                )}
              </FormField>
              <FormField id="motto" label="Motto" error={form.formState.errors.motto?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} {...fieldProps} {...form.register("motto")} />
                )}
              </FormField>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={updateOrg.isPending}>
                {updateOrg.isPending && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <dl className="divide-y">
              <DetailRow label="Organization">{org.name}</DetailRow>
              <DetailRow label="Code">{org.code}</DetailRow>
              <DetailRow label="Sector">{org.sector}</DetailRow>
              <DetailRow label="Established">{org.establishedYear}</DetailRow>
              <DetailRow label="Headquarters">{org.address}</DetailRow>
              <DetailRow label="Phone">{org.phone}</DetailRow>
              <DetailRow label="Email">{org.email}</DetailRow>
              <DetailRow label="Tax ID">{org.taxId}</DetailRow>
              <DetailRow label="Motto">
                <span className="italic text-muted-foreground">&ldquo;{org.motto}&rdquo;</span>
              </DetailRow>
            </dl>
            <Button variant="outline" className="mt-4" onClick={() => setEditing(true)}>
              <Pencil />
              Edit organization
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold tabular-nums leading-none">{value}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="ml-auto text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Manage
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function OrganizationOverview() {
  const { data: stats, isPending } = useOrgStats();

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Organization metrics">
        <StatCard label="Departments" value={isPending ? "…" : (stats?.departments ?? 0)} icon={Building2} href="/admin/organization/departments" />
        <StatCard label="Positions" value={isPending ? "…" : (stats?.positions ?? 0)} icon={Briefcase} href="/admin/organization/positions" />
        <StatCard label="Active employees" value={isPending ? "…" : (stats?.employees ?? 0)} icon={UsersRound} href="/admin/organization/employees" />
        <StatCard label="Active approval rules" value={isPending ? "…" : (stats?.activeRules ?? 0)} icon={Scale} href="/admin/organization/approval-authority" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrgProfileCard />

        <Card>
          <CardHeader>
            <CardTitle>Structure at a glance</CardTitle>
            <CardDescription>
              Departments, employees, and authority in one view.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              <li className="flex items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-2.5 text-sm">
                  <Landmark className="size-4 text-muted-foreground" />
                  Reporting lines
                </span>
                <Link
                  href="/admin/organization/hierarchy"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View hierarchy
                </Link>
              </li>
              <li className="flex items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-2.5 text-sm">
                  <Users className="size-4 text-muted-foreground" />
                  Employee directory
                </span>
                <Link
                  href="/admin/organization/employees"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Manage staff
                </Link>
              </li>
              <li className="flex items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-2.5 text-sm">
                  <Scale className="size-4 text-muted-foreground" />
                  Approval authority
                </span>
                <Link
                  href="/admin/organization/approval-authority"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Configure rules
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}