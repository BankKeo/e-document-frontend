"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Loader2,
  Package,
  TriangleAlert,
  Truck,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useWarehouseDashboard,
  type ForecastRow,
} from "../api/dashboard.queries";

const RECOMMENDATION_TONE: Record<
  string,
  { variant: "destructive" | "secondary" | "default"; label: string }
> = {
  Order: { variant: "destructive", label: "Order (FORECAST-008)" },
  Monitor: { variant: "secondary", label: "Monitor" },
  Ok: { variant: "default", label: "Ok" },
};

export function WarehouseDashboard() {
  const { data, isPending, isError, refetch } = useWarehouseDashboard();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Aggregating warehouse data…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load warehouse data.</p>
        <button
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
          label="Warehouses"
          value={summary.warehouseCount}
          icon={WarehouseIcon}
          trend={`${summary.utilization}% utilized`}
        />
        <KpiCard
          label="Units on hand"
          value={summary.totalUnits}
          icon={Boxes}
        />
        <KpiCard
          label="Low stock"
          value={summary.lowStock}
          icon={TriangleAlert}
          trendDirection="down"
        />
        <KpiCard label="Overstock" value={summary.overstock} icon={Package} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/warehouse/inbound" className="block">
          <StatCard
            label="Open inbound (IN)"
            value={summary.inboundOpen}
            icon={ArrowDownToLine}
          />
        </Link>
        <Link href="/warehouse/outbound" className="block">
          <StatCard
            label="Open outbound (OUT)"
            value={summary.outboundOpen}
            icon={ArrowUpFromLine}
          />
        </Link>
        <Link href="/warehouse/transfers" className="block">
          <StatCard
            label="Transfers in transit"
            value={summary.transfersOpen}
            icon={Truck}
          />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory forecasting (FORECAST-001…008)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium">Avg consumption</th>
                  <th className="py-2 pr-3 font-medium">Demand forecast</th>
                  <th className="py-2 pr-3 font-medium">Safety stock</th>
                  <th className="py-2 pr-3 font-medium">Reorder pt.</th>
                  <th className="py-2 pr-3 font-medium">On hand</th>
                  <th className="py-2 pr-3 font-medium">Days to stockout</th>
                  <th className="py-2 font-medium">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {summary.forecast.map((row: ForecastRow) => {
                  const tone = RECOMMENDATION_TONE[row.recommendation];
                  return (
                    <tr key={row.sku}>
                      <td className="py-2 pr-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {row.sku}
                        </span>{" "}
                        {row.name}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums">
                        {row.avgConsumption}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums">
                        {row.demandForecast}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums">
                        {row.safetyStock}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums">
                        {row.reorderPoint}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums">
                        {row.currentStock}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums">
                        {row.daysUntilStockout}d
                      </td>
                      <td className="py-2">
                        <Badge variant={tone.variant}>{tone.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm transition-colors hover:bg-muted">
      <div>
        <p className="font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
      <Icon className="size-5 text-muted-foreground" />
    </div>
  );
}
