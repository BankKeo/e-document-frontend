"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSFER_WAREHOUSES } from "../mock/data";
import { useCreateStockTransfer } from "../api/transfer.queries";

const CATALOG = [
  { itemName: "Paper A4 80gsm", sku: "SKU-001", unit: "ream" },
  { itemName: "Ink Toner HP 63", sku: "SKU-002", unit: "unit" },
  { itemName: "Office Desk", sku: "SKU-003", unit: "unit" },
  { itemName: "Pallet Racking Frame", sku: "SKU-007", unit: "bay" },
  { itemName: "General Purpose Cleaner", sku: "SKU-006", unit: "litre" },
];

export function CreateTransferDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateStockTransfer();
  const [fromWarehouse, setFromWarehouse] = React.useState(
    TRANSFER_WAREHOUSES[0]
  );
  const [toWarehouse, setToWarehouse] = React.useState(TRANSFER_WAREHOUSES[1]);
  const [lines, setLines] = React.useState<{ sku: string; qty: string }[]>([
    { sku: "", qty: "1" },
  ]);

  function addLine() {
    setLines((prev) => [...prev, { sku: "", qty: "1" }]);
  }

  async function submit() {
    if (fromWarehouse === toWarehouse) {
      toast.error("Source and destination must differ.");
      return;
    }
    const parsedLines = lines
      .map((line) => {
        const item = CATALOG.find((entry) => entry.sku === line.sku);
        if (!item) return null;
        return {
          itemName: item.itemName,
          sku: item.sku,
          quantity: Number(line.qty) || 1,
          unit: item.unit,
        };
      })
      .filter(
        (
          line
        ): line is {
          itemName: string;
          sku: string;
          quantity: number;
          unit: string;
        } => Boolean(line)
      );
    if (parsedLines.length === 0) {
      toast.error("Choose at least one item.");
      return;
    }
    try {
      await create.mutateAsync({
        fromWarehouse,
        toWarehouse,
        lines: parsedLines,
      });
      toast.success("Transfer created (STOCK-003)");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New stock transfer</DialogTitle>
          <DialogDescription>
            Move stock between warehouses. Each transfer is traceable.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="trf-from">From</Label>
              <Select
                value={fromWarehouse}
                onValueChange={(value) =>
                  setFromWarehouse(value ?? TRANSFER_WAREHOUSES[0])
                }
              >
                <SelectTrigger id="trf-from" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFER_WAREHOUSES.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trf-to">To</Label>
              <Select
                value={toWarehouse}
                onValueChange={(value) =>
                  setToWarehouse(value ?? TRANSFER_WAREHOUSES[1])
                }
              >
                <SelectTrigger id="trf-to" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFER_WAREHOUSES.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
              >
                <Plus />
                Add item
              </Button>
            </div>
            {lines.map((line, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_80px]"
              >
                <Select
                  value={line.sku}
                  onValueChange={(value) =>
                    setLines((prev) =>
                      prev.map((entry, i) =>
                        i === index ? { ...entry, sku: value ?? "" } : entry
                      )
                    )
                  }
                >
                  <SelectTrigger className="w-full" aria-label="Item">
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOG.map((item) => (
                      <SelectItem key={item.sku} value={item.sku}>
                        {item.itemName} · {item.sku}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  aria-label="Quantity"
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(event) =>
                    setLines((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, qty: event.target.value }
                          : entry
                      )
                    )
                  }
                />
              </div>
            ))}
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
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending && <Loader2 className="animate-spin" />}
            Create transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
