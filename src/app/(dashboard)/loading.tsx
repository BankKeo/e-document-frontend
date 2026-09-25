export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <div className="h-6 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg border bg-muted/50"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-lg border bg-muted/50" />
    </div>
  );
}
