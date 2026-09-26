"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
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
import { useRestoreVersion } from "../api/versioning.queries";
import type { VersionRegistryRow } from "../types";

export function RestoreVersionDialog({
  row,
  onOpenChange,
}: {
  row: VersionRegistryRow;
  onOpenChange: (open: boolean) => void;
}) {
  const restore = useRestoreVersion();
  const [pending, setPending] = React.useState(false);

  async function confirmRestore() {
    setPending(true);
    try {
      await restore.mutateAsync({
        id: row.documentId,
        versionId: row.versionId,
      });
      toast.success(`Restored version ${row.version}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to restore."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restore version {row.version}</DialogTitle>
          <DialogDescription>
            {row.documentTitle} — restoring copies this version&apos;s file and
            content into a new current version so the history stays intact.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 rounded-lg border p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Version</span>
            <Badge variant="outline">{row.version}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Actor</span>
            <span className="font-medium">{row.actor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {new Date(row.at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">File</span>
            <span className="max-w-[60%] truncate font-mono text-xs">
              {row.fileName}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button onClick={confirmRestore} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <RotateCcw />}
            Restore version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
