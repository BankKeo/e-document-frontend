"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpFromLine,
  Loader2,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAdvanceOutbound, useOutboundIssue } from "../api/outbound.queries";

const FLOW = [
  "Requested",
  "Approved",
  "Picking",
  "Packed",
  "Issued",
  "Delivered",
];

const ADVANCE_LABEL: Record<string, string> = {
  Requested: "Approve (OUT-003)",
  Approved: "Start picking (OUT-004)",
  Picking: "Pack goods (OUT-005)",
  Packed: "Issue goods (OUT-007)",
  Issued: "Confirm delivery",
};

export function OutboundDetail({ id }: { id: string }) {
  const { data: issue, isPending, isError, refetch } = useOutboundIssue(id);
  const advance = useAdvanceOutbound();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading outbound issue…
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load outbound issue</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/warehouse/outbound"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to outbound
          </Link>
        </div>
      </div>
    );
  }

  const current = issue;
  const flowIndex = FLOW.indexOf(current.status);

  async function handleAdvance() {
    try {
      await advance.mutateAsync(current.id);
      toast.success("Issue advanced");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  const nextAction = ADVANCE_LABEL[current.status];

  return (
    <div className="grid gap-6">
      <Link
        href="/warehouse/outbound"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to outbound
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.ref}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {current.department} · requested by {current.requester} ·{" "}
              {current.warehouse}
            </p>
          </div>
          {nextAction && current.status !== "Delivered" ? (
            <Button
              size="sm"
              onClick={handleAdvance}
              disabled={advance.isPending}
            >
              {advance.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowUpFromLine />
              )}
              {nextAction}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Outbound flow</CardTitle>
          <CardDescription>
            Department request → approval → picking → packing → issue →
            delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {FLOW.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${
                    index <= flowIndex
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {index < FLOW.length - 1 ? (
                  <span className="h-px w-4 bg-border" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="size-4 text-muted-foreground" />
            Items to issue
          </CardTitle>
          <CardDescription>
            Quantities are barcode-scanned during picking (OUT-006/007).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {current.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-center gap-3 py-2.5 text-sm"
              >
                <span className="min-w-0 flex-1">
                  <span className="truncate">{line.itemName}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {line.sku}
                  </span>
                </span>
                <span className="font-mono text-sm tabular-nums">
                  {line.quantity} {line.unit}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
