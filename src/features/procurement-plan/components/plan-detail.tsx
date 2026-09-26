"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Send, ThumbsUp } from "lucide-react";
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
import { usePlan, useSetPlanStatus } from "../api/plan.queries";
import { formatCurrency } from "../utils";

export function PlanDetail({ id }: { id: string }) {
  const { data: plan, isPending, isError, refetch } = usePlan(id);
  const setStatus = useSetPlanStatus();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading plan…
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load plan</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/procurement/plans"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to plans
          </Link>
        </div>
      </div>
    );
  }

  const current = plan;
  const lineTotal = current.items.reduce(
    (sum, item) => sum + item.quantity * item.estimatedCost,
    0
  );

  async function advance() {
    const next =
      current.status === "Draft"
        ? "Submitted"
        : current.status === "Submitted"
          ? "Approved"
          : null;
    if (!next) return;
    try {
      await setStatus.mutateAsync({ id: current.id, status: next });
      toast.success(`Plan → ${next}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/procurement/plans"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to plans
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
              {current.ref} · FY {current.fiscalYear} · {current.department}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="outline">{current.category}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {current.status === "Draft" ? (
              <Button
                size="sm"
                onClick={advance}
                disabled={setStatus.isPending}
              >
                <Send /> Submit
              </Button>
            ) : null}
            {current.status === "Submitted" ? (
              <Button
                size="sm"
                onClick={advance}
                disabled={setStatus.isPending}
              >
                <ThumbsUp /> Approve
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
            <CardDescription>
              Planned procurement items with quantities (PLAN-003/007).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {current.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 py-2.5 text-sm"
                >
                  <span className="min-w-0 flex-1">{item.description}</span>
                  <span className="shrink-0 text-muted-foreground">
                    × {item.quantity}
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {formatCurrency(item.estimatedCost)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between pt-2 text-sm font-medium">
                <span>Estimated line total</span>
                <span className="font-mono tabular-nums">
                  {formatCurrency(lineTotal)}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financials</CardTitle>
            <CardDescription>
              Budget allocation and estimate (PLAN-004).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Budget</dt>
                <dd className="font-mono tabular-nums">
                  {formatCurrency(current.budget)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estimated cost</dt>
                <dd className="font-mono tabular-nums">
                  {formatCurrency(current.estimatedCost)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Planned purchase date</dt>
                <dd>{new Date(current.plannedDate).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Owner</dt>
                <dd className="font-medium">{current.owner}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
