"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, History, Loader2, ThumbsUp } from "lucide-react";
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
import {
  useRequisition,
  useSetRequisitionStatus,
} from "../api/requisition.queries";
import { formatCurrency } from "../utils";

const PIPELINE = ["Department", "Budget Approval", "Procurement"];

export function RequisitionDetail({ id }: { id: string }) {
  const { data: requisition, isPending, isError, refetch } = useRequisition(id);
  const setStatus = useSetRequisitionStatus();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading requisition…
      </div>
    );
  }

  if (isError || !requisition) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load requisition</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/procurement/requisitions"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to requisitions
          </Link>
        </div>
      </div>
    );
  }

  const current = requisition;

  async function advance() {
    const flow: Record<
      string,
      {
        status: "Department Approval" | "Budget Approval" | "Approved";
        label: string;
      }
    > = {
      Submitted: {
        status: "Department Approval",
        label: "Department approval",
      },
      "Department Approval": {
        status: "Budget Approval",
        label: "Budget approval",
      },
      "Budget Approval": { status: "Approved", label: "Fully approved" },
    };
    const next = flow[current.status];
    if (!next) return;
    try {
      await setStatus.mutateAsync({
        id: current.id,
        status: next.status,
        action: next.label,
      });
      toast.success(
        next.label === "Fully approved"
          ? "Requisition approved"
          : `Advanced to ${next.status}`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/procurement/requisitions"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to requisitions
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.title}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.ref} · {current.department}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="outline">{current.category}</Badge>
              <Badge variant="secondary">Requester: {current.requester}</Badge>
            </div>
          </div>
          {["Submitted", "Department Approval", "Budget Approval"].includes(
            current.status
          ) ? (
            <Button size="sm" onClick={advance} disabled={setStatus.isPending}>
              {setStatus.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ThumbsUp />
              )}
              Advance approval
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Approval pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Approval pipeline</CardTitle>
          <CardDescription>
            Department → Budget → Procurement approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {PIPELINE.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${
                    (current.status === "Department Approval" && index === 0) ||
                    (current.status === "Budget Approval" && index <= 1) ||
                    (current.status === "Approved" && index <= 2)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {index < PIPELINE.length - 1 ? (
                  <span className="h-px w-4 bg-border" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              Requested items with specification, quantity, and price
              (PR-002…006).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {current.items.map((item) => (
                <li key={item.id} className="grid gap-1 py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 font-medium">
                      {item.description}
                    </span>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatCurrency(item.quantity * item.estimatedPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Spec: {item.spec || "—"} · {item.quantity} {item.unit} ×{" "}
                    {formatCurrency(item.estimatedPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Required by{" "}
                    {new Date(item.requiredDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
              <li className="flex items-center justify-between pt-2 text-sm font-medium">
                <span>Total</span>
                <span className="font-mono tabular-nums">
                  {formatCurrency(current.total)}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-4 text-muted-foreground" />
              History (PR-013)
            </CardTitle>
            <CardDescription>
              Full life cycle audit of this requisition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {current.history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No history recorded.
              </p>
            ) : (
              <ol className="relative grid gap-4 border-l pl-4">
                {current.history.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute top-1.5 -left-[21px] size-1.5 rounded-full bg-foreground/30" />
                    <p className="text-sm">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.actor} · {new Date(entry.at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
