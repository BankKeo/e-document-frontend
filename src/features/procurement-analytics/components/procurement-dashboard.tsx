"use client";

import * as React from "react";
import Link from "next/link";
import {
  CircleDollarSign,
  Gavel,
  Loader2,
  ShoppingCart,
  TimerReset,
  Truck,
  Users,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProcurementSummary } from "../api/analytics.queries";
import { SpendBars, formatCurrency } from "./spend-bars";

export function ProcurementDashboard() {
  const { data, isPending, isError, refetch } = useProcurementSummary();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Aggregating procurement data…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load analytics.</p>
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

  const summary = data;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active spend"
          value={formatCurrency(summary.totalSpend)}
          icon={CircleDollarSign}
          trend="Across active contracts"
        />
        <KpiCard
          label="Awarded tender value"
          value={formatCurrency(summary.awardedTenderValue)}
          icon={Gavel}
        />
        <KpiCard
          label="Active suppliers"
          value={summary.supplierCount}
          icon={Users}
        />
        <KpiCard
          label="Contracts expiring ≤ 90d"
          value={summary.expiringContracts}
          icon={TimerReset}
          trendDirection="down"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Requisitions"
          value={summary.prCount}
          icon={ShoppingCart}
        />
        <KpiCard label="Tenders" value={summary.tenderCount} icon={Gavel} />
        <KpiCard
          label="Avg cycle time"
          value={`${summary.avgCycleDays}d`}
          icon={TimerReset}
        />
        <KpiCard
          label="Deliveries this period"
          value={summary.deliveriesForMonth}
          icon={Truck}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spend by department (ANA-002)</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendBars
              title="Annual plan estimates"
              rows={summary.spendByDepartment}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by supplier (ANA-003)</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendBars
              title="Active contract value"
              rows={summary.spendBySupplier}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spend by category (ANA-004)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <SpendBars title="Requisition value" rows={summary.spendByCategory} />

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Quick links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-1.5 text-sm">
                <QuickLink
                  href="/procurement/plans"
                  label="Procurement plans (ANA-001)"
                />
                <QuickLink
                  href="/procurement/requisitions"
                  label="PR statistics (ANA-006)"
                />
                <QuickLink
                  href="/procurement/tenders"
                  label="Tender statistics (ANA-007)"
                />
                <QuickLink
                  href="/procurement/suppliers"
                  label="Supplier performance (ANA-008)"
                />
                <QuickLink
                  href="/procurement/contracts"
                  label="Contract expiration (ANA-009)"
                />
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4"
      >
        {label}
      </Link>
    </li>
  );
}
