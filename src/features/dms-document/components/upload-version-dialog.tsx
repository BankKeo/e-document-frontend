"use client";

import * as React from "react";
import { toast } from "sonner";
import { FileText, Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUploadVersion } from "../api/document.queries";
import type { DmsDocument } from "../types";
import { formatBytes } from "../utils";

export function UploadVersionDialog({
  document,
  onOpenChange,
}: {
  document: DmsDocument;
  onOpenChange: (open: boolean) => void;
}) {
  const upload = useUploadVersion();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(null);
  const [summary, setSummary] = React.useState("");

  const nextVersion = document.versions[0]?.version;

  async function submit() {
    if (!file) return;
    try {
      await upload.mutateAsync({ id: document.id, file, summary });
      toast.success(`${nextVersion} uploaded`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new version</DialogTitle>
          <DialogDescription>
            {document.title} — the next version will be{" "}
            {nextVersion ? `after ${nextVersion}` : "v1.0"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                if (selected) {
                  setFile({ name: selected.name, size: selected.size });
                }
              }}
            />
            {file ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm font-medium">{file.name}</span>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => inputRef.current?.click()}
              >
                <Upload />
                Choose file
              </Button>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upload-summary">Change note</Label>
            <Textarea
              id="upload-summary"
              rows={3}
              placeholder="What changed in this version?"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={upload.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!file || upload.isPending}>
            {upload.isPending && <Loader2 className="animate-spin" />}
            Upload version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}