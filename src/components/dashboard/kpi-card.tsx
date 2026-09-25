import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  trend,
  trendDirection = "up",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {trend ? (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
            trendDirection === "up" ? "text-success" : "text-destructive"
          )}
        >
          {trendDirection === "up" ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          {trend}
        </p>
      ) : null}
    </div>
  );
}
