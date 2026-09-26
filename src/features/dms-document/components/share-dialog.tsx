"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Copy, Link2, Loader2, Mail, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useShareDocument,
  useUnshareDocument,
} from "../api/document.queries";
import type { DmsDocument } from "../types";

export function ShareDialog({
  document,
  onOpenChange,
}: {
  document: DmsDocument;
  onOpenChange: (open: boolean) => void;
}) {
  const share = useShareDocument();
  const unshare = useUnshareDocument();
  const [email, setEmail] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [sharedWith, setSharedWith] = React.useState<string[]>(document.sharedWith);

  const shareLink = `https://edemo.local/share/${document.id}`;

  async function addRecipient() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    try {
      const next = await share.mutateAsync({ id: document.id, emails: [trimmed] });
      setSharedWith(next.sharedWith);
      setEmail("");
      toast.success(`Shared with ${trimmed}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to share.");
    }
  }

  async function removeRecipient(recipientEmail: string) {
    try {
      const next = await unshare.mutateAsync({ id: document.id, email: recipientEmail });
      setSharedWith(next.sharedWith);
      toast.success("Access removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Share link copied");
    } catch {
      toast.error("Unable to copy link.");
    }
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
          <DialogDescription>
            {document.title} — people you share with get read access to all
            versions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="share-email" className="text-sm font-medium">
              People with access
            </label>
            {sharedWith.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not shared yet.</p>
            ) : (
              <ul className="grid gap-2">
                {sharedWith.map((recipient) => (
                  <li
                    key={recipient}
                    className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Mail className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">{recipient}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground"
                      onClick={() => void removeRecipient(recipient)}
                      disabled={unshare.isPending}
                      aria-label={`Remove ${recipient}`}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              id="share-email"
              type="email"
              placeholder="colleague@acme.gov"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void addRecipient();
                }
              }}
            />
            <Button onClick={addRecipient} disabled={share.isPending}>
              {share.isPending && <Loader2 className="animate-spin" />}
              Add
            </Button>
          </div>

          <div className="grid gap-2">
            <label htmlFor="share-link" className="text-sm font-medium">
              Share link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="share-link" value={shareLink} readOnly className="pl-8 font-mono text-xs" />
              </div>
              <Button variant="outline" onClick={copyLink}>
                {copied ? <Check className="text-emerald-500" /> : <Copy />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {document.sharedWith.length > 0 ? (
              <Badge variant="outline">{document.sharedWith.length} shared</Badge>
            ) : (
              <Badge variant="secondary">Not shared</Badge>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}