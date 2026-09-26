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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateVersion,
  useVersioningDocuments,
} from "../api/versioning.queries";
import type { DmsDocument } from "../types";
import { formatBytes } from "../utils";

export function CreateVersionDialog({
  defaultDocumentId,
  onOpenChange,
}: {
  defaultDocumentId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateVersion();
  const { data: documents } = useVersioningDocuments();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [documentId, setDocumentId] = React.useState(defaultDocumentId ?? "");
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(
    null
  );
  const [summary, setSummary] = React.useState("");

  const document = documents?.find((entry) => entry.id === documentId) as
    DmsDocument | undefined;
  const nextVersion = document?.versions[0]?.version;

  async function submit() {
    if (!document || !file) return;
    try {
      await create.mutateAsync({ id: document.id, file, summary });
      toast.success(`New version saved after ${nextVersion}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create version."
      );
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create version</DialogTitle>
          <DialogDescription>
            Add a new version of a document. History stays immutable — the new
            version becomes the current one.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="create-version-document">Document</Label>
            <Select
              value={documentId}
              onValueChange={(value) => setDocumentId(value ?? "")}
            >
              <SelectTrigger id="create-version-document" className="w-full">
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {documents?.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    {entry.title} · {entry.versions[0]?.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {document ? (
              <p className="text-xs text-muted-foreground">
                Next version will be after {nextVersion}. Current file:{" "}
                <span className="font-mono">
                  {document.versions[0]?.fileName}
                </span>
              </p>
            ) : null}
          </div>

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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-version-note">Change note</Label>
            <Textarea
              id="create-version-note"
              rows={3}
              placeholder="What changed in this version?"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!document || !file || create.isPending}
          >
            {create.isPending && <Loader2 className="animate-spin" />}
            Create version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
