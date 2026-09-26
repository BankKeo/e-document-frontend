"use client";

import * as React from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUploadCaptureDocument } from "../api/capture.queries";
import { formatBytes } from "../utils";

export function UploadCaptureDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const upload = useUploadCaptureDocument();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(
    null
  );

  async function submit() {
    if (!file) return;
    try {
      await upload.mutateAsync(file);
      toast.success("Scan uploaded — starting AI pipeline");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload scanned document</DialogTitle>
          <DialogDescription>
            The document runs through preprocessing, OCR, classification, and AI
            extraction automatically (AI-001…AI-012).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.png,.tiff"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected)
                setFile({ name: selected.name, size: selected.size });
            }}
          />
          {file ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium">
                  {file.name}
                </span>
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
          <div className="grid gap-1.5">
            <Label>Pipeline (automatic)</Label>
            <ol className="grid gap-1 text-xs text-muted-foreground">
              <li>1. Image preprocessing — deskew & contrast (AI-002)</li>
              <li>2. OCR — full text extraction (AI-003 / AI-004)</li>
              <li>3. Classification by content (AI-009)</li>
              <li>4. AI field extraction + auto-tagging (AI-005…AI-011)</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={upload.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={!file || upload.isPending}>
            {upload.isPending && <Loader2 className="animate-spin" />}
            Upload scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
