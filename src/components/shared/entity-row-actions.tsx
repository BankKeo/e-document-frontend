"use client";

import * as React from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EntityRowActions({
  onEdit,
  onDelete,
  title,
  description,
  canDelete = true,
}: {
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
  title: string;
  description?: string;
  canDelete?: boolean;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function handleDelete() {
    setBusy(true);
    try {
      await onDelete?.();
      toast.success("Deleted");
      setConfirmOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete.");
      setConfirmOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Row actions" />}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {onEdit ? (
            <DropdownMenuItem
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
          ) : null}
          {onEdit && onDelete ? <DropdownMenuSeparator /> : null}
          {onDelete ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={!canDelete}
              title={canDelete ? undefined : "Not available"}
              onClick={() => {
                setMenuOpen(false);
                if (canDelete) setConfirmOpen(true);
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}