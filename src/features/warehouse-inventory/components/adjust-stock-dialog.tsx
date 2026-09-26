"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdjustStock } from "../api/inventory.queries";
import type { InventoryItem } from "../types";

export function AdjustStockDialog({
  item,
  onOpenChange,
}: {
  item: InventoryItem;
  onOpenChange: (open: boolean) => void;
}) {
  const adjust = useAdjustStock();
  const [quantity, setQuantity] = React.useState("0");
  const [reason, setReason] = React.useState("Count variance");

  async function submit() {
    const qty = Number(quantity) || 0;
    if (qty === 0) {
      toast.error("Enter a non-zero adjustment.");
      return;
    }
    try {
      await adjust.mutateAsync({ id: item.id, quantity: qty, reason });
      toast.success("Stock adjusted (STOCK-004)");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to adjust.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust stock — {item.name}</DialogTitle>
          <DialogDescription>
            Positive adds units, negative removes (physical count / STOCK-009).
            A traceable ADJUSTMENT movement is recorded.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="adjust-qty">Delta (e.g. -2 or +5)</Label>
            <Input
              id="adjust-qty"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adjust-reason">Reason</Label>
            <Input
              id="adjust-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono tabular-nums">
              {item.currentStock} {item.unit}
            </span>
            <span>→</span>
            <span className="font-mono font-semibold tabular-nums">
              {Math.max(0, item.currentStock + (Number(quantity) || 0))}{" "}
              {item.unit}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={adjust.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={adjust.isPending}>
            {adjust.isPending && <Loader2 className="animate-spin" />}
            Apply adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
