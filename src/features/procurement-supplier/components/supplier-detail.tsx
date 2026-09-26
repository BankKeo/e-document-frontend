"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Loader2,
  Mail,
  Paperclip,
  Phone,
  Shuffle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { useSetSupplierStatus, useSupplier } from "../api/supplier.queries";
import type { SupplierStatus } from "../types";

const LIFECYCLE: SupplierStatus[] = [
  "Draft",
  "Submitted",
  "Under Review",
  "Verified",
  "Approved",
  "Active",
  "Suspended",
  "Blacklisted",
];

export function SupplierDetail({ id }: { id: string }) {
  const { data: supplier, isPending, isError, refetch } = useSupplier(id);
  const setStatus = useSetSupplierStatus();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading supplier…
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load supplier</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/procurement/suppliers"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to suppliers
          </Link>
        </div>
      </div>
    );
  }

  const current = supplier;
  const lifecycleIndex = LIFECYCLE.indexOf(current.status);

  async function advance() {
    const next = LIFECYCLE[lifecycleIndex + 1];
    if (!next) return;
    try {
      await setStatus.mutateAsync({ id: current.id, status: next });
      toast.success(`Status → ${next}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  async function suspend() {
    try {
      await setStatus.mutateAsync({ id: current.id, status: "Suspended" });
      toast.success("Supplier suspended");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/procurement/suppliers"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to suppliers
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.name}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.ref} · Tax {current.taxId} · {current.country}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {current.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
            {current.evaluation ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Rating {current.evaluation.score.toFixed(1)} (
                {current.evaluation.rating}) ·{" "}
                {new Date(
                  current.evaluation.lastEvaluated
                ).toLocaleDateString()}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {["Submitted", "Under Review", "Verified"].includes(
              current.status
            ) ? (
              <Button
                size="sm"
                onClick={advance}
                disabled={setStatus.isPending}
              >
                {setStatus.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Shuffle />
                )}
                Advance
              </Button>
            ) : null}
            {current.status === "Active" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={suspend}
                disabled={setStatus.isPending}
              >
                Suspend
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle stepper */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier lifecycle</CardTitle>
          <CardDescription>
            Draft → Submitted → Under Review → Verified → Approved → Active →
            Suspended → Blacklisted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {LIFECYCLE.map((step, index) => {
              const reached = index <= lifecycleIndex;
              return (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs font-medium",
                      reached
                        ? current.status === "Suspended"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : current.status === "Blacklisted"
                            ? "border-red-500/40 bg-red-500/10 text-destructive"
                            : "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {step}
                  </span>
                  {index < LIFECYCLE.length - 1 ? (
                    <span className="h-px w-4 bg-border" aria-hidden />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              Contacts (SUP-007)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {current.contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contacts recorded.
              </p>
            ) : (
              <ul className="grid gap-2">
                {current.contacts.map((contact) => (
                  <li key={contact.id} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">
                      {contact.name} · {contact.role}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> {contact.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {contact.phone}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                Bank information (SUP-008)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {current.bankInfo ? (
                <dl className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd className="font-medium">{current.bankInfo.bank}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Account name</dt>
                    <dd className="font-medium">
                      {current.bankInfo.accountName}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Account number</dt>
                    <dd className="font-mono text-sm">
                      {current.bankInfo.accountNumber}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Bank details not on file.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="size-4 text-muted-foreground" />
                Documents (SUP-005)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!current.documents || current.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents uploaded.
                </p>
              ) : (
                <ul className="grid gap-1.5">
                  {current.documents.map((document) => (
                    <li
                      key={document.id}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Paperclip className="size-3.5" />
                      <span className="font-mono text-xs">{document.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {document.type}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
