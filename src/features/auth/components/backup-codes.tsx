"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Unable to copy. Select the text manually.");
    }
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={copy}>
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function BackupCodesList({ codes }: { codes: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {codes.map((code, index) => (
        <li
          key={code}
          className="flex items-center justify-between rounded border bg-muted/40 px-2.5 py-1.5 font-mono text-xs"
        >
          <span>
            {String(index + 1).padStart(2, "0")}. {code}
          </span>
          <CopyButton text={code} label="Backup code" />
        </li>
      ))}
    </ul>
  );
}