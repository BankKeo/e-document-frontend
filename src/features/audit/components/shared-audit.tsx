"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { exportCsv, formatRelative } from "../utils";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ActorCell({ name, email }: { name: string; email: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}

export function TimeCell({ at }: { at: string }) {
  return (
    <span
      className="whitespace-nowrap text-muted-foreground"
      title={new Date(at).toLocaleString()}
    >
      {formatRelative(at)}
    </span>
  );
}

export function ExportButton({
  filename,
  rows,
}: {
  filename: string;
  rows: Record<string, unknown>[];
}) {
  function handleExport() {
    if (rows.length === 0) {
      toast.info("Nothing to export");
      return;
    }
    exportCsv(filename, rows);
    toast.success(`Exported ${rows.length} rows`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download />
      Export CSV
    </Button>
  );
}