"use client";

import * as React from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { DocumentVersion } from "@/features/dms-document/types";
import { useCompareVersions } from "../api/versioning.queries";
import { diffLines, formatBytes } from "../utils";

export function CompareVersionsDialog({
  documentId,
  documentTitle,
  versions,
  initialLeftId,
  initialRightId,
  onOpenChange,
}: {
  documentId: string;
  documentTitle: string;
  versions: DocumentVersion[];
  initialLeftId?: string;
  initialRightId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const sorted = [...versions].sort((a, b) => (a.version < b.version ? -1 : 1));
  const [leftId, setLeftId] = React.useState(
    initialLeftId ?? sorted[0]?.id ?? ""
  );
  const [rightId, setRightId] = React.useState(
    initialRightId ?? sorted[sorted.length - 1]?.id ?? ""
  );

  const compare = useCompareVersions(documentId, leftId, rightId);
  const left = sorted.find((entry) => entry.id === leftId);
  const right = sorted.find((entry) => entry.id === rightId);

  const rows = React.useMemo(
    () =>
      compare.data
        ? diffLines(compare.data.left.content, compare.data.right.content)
        : [],
    [compare.data]
  );

  const added = rows.filter((row) => row.kind === "added").length;
  const removed = rows.filter((row) => row.kind === "removed").length;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare versions</DialogTitle>
          <DialogDescription>{documentTitle}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="compare-left" className="text-sm font-medium">
                Earlier version
              </label>
              <Select
                value={leftId}
                onValueChange={(value) => setLeftId(value ?? "")}
              >
                <SelectTrigger id="compare-left" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sorted.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.version} — {version.summary}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="compare-right" className="text-sm font-medium">
                Later version
              </label>
              <Select
                value={rightId}
                onValueChange={(value) => setRightId(value ?? "")}
              >
                <SelectTrigger id="compare-right" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sorted.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.version} — {version.summary}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline">
              <Minus className="size-3" /> {removed} removed
            </Badge>
            <Badge variant="outline">
              <Plus className="size-3" /> {added} added
            </Badge>
            {left && right ? (
              <span className="ml-auto font-mono text-muted-foreground">
                {left.fileName} ({formatBytes(left.size)}) → {right.fileName} (
                {formatBytes(right.size)})
              </span>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-2 divide-x">
              <div className="border-b px-3 py-2 text-sm font-medium">
                {left ? <span className="font-mono">{left.version}</span> : "—"}
              </div>
              <div className="border-b px-3 py-2 text-sm font-medium">
                {right ? (
                  <span className="font-mono">{right.version}</span>
                ) : (
                  "—"
                )}
              </div>
            </div>
            {compare.isPending ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Comparing versions…
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {rows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 divide-x border-b last:border-b-0"
                  >
                    <pre
                      className={cn(
                        "px-3 py-1.5 font-mono text-xs whitespace-pre-wrap",
                        row.kind === "removed"
                          ? "bg-red-500/10 text-destructive"
                          : row.kind === "added"
                            ? "bg-muted/40 text-muted-foreground"
                            : "text-foreground/80"
                      )}
                    >
                      {row.left}
                      {row.kind === "removed" && !row.left ? "\u00A0" : null}
                    </pre>
                    <pre
                      className={cn(
                        "px-3 py-1.5 font-mono text-xs whitespace-pre-wrap",
                        row.kind === "added"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : row.kind === "removed"
                            ? "bg-muted/40 text-muted-foreground"
                            : "text-foreground/80"
                      )}
                    >
                      {row.right}
                      {row.kind === "added" && !row.right ? "\u00A0" : null}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
