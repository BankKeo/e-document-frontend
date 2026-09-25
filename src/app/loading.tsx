export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center gap-4 p-8">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-72 animate-pulse rounded bg-muted" />
    </main>
  );
}
