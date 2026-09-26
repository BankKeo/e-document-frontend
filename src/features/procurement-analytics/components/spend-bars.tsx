import type { CategorySpend } from "../api/analytics.queries";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function SpendBars({
  title,
  rows,
}: {
  title: string;
  rows: CategorySpend[];
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data.</p>
      ) : (
        <ul className="grid gap-2">
          {rows.map((row) => (
            <li key={row.name} className="grid gap-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{row.name}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatCurrency(row.value)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${Math.round((row.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
