"use client";

import { FileText, UserRound, CalendarClock } from "lucide-react";
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
import type { VersionRegistryRow } from "../types";
import { formatBytes } from "../utils";

export function ViewVersionDialog({
  row,
  onOpenChange,
}: {
  row: VersionRegistryRow;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Version {row.version}</DialogTitle>
          <DialogDescription>
            {row.documentTitle}
            <span className="ml-2 font-mono text-muted-foreground">
              {row.docRef}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {row.isCurrent ? (
              <Badge>Current</Badge>
            ) : (
              <Badge variant="outline">Superseded</Badge>
            )}
            <Badge variant="secondary">
              {row.index + 1} of {row.total}
            </Badge>
            <Badge variant="secondary">{row.category}</Badge>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Actor</dt>
                <dd className="font-medium">{row.actor}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="font-medium">
                  {new Date(row.at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
            </div>
          </dl>

          <div className="grid gap-2">
            <dt className="text-sm font-medium">File</dt>
            <dd className="flex items-center gap-2 rounded-lg border p-2.5 text-sm">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-mono text-xs">{row.fileName}</span>
              <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatBytes(row.size)}
              </span>
            </dd>
          </div>

          <div className="grid gap-2">
            <dt className="text-sm font-medium">Change note</dt>
            <dd className="text-sm text-muted-foreground">{row.summary}</dd>
          </div>

          <div className="grid gap-2">
            <dt className="text-sm font-medium">Content preview</dt>
            <dd>
              <pre className="max-h-64 overflow-y-auto rounded-lg bg-muted/50 p-4 font-sans text-sm whitespace-pre-wrap text-foreground/90">
                {row.content}
              </pre>
            </dd>
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
