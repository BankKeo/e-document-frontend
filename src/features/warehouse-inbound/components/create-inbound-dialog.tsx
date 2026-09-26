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
import { INBOUND_WAREHOUSES } from "../mock/service";
import { useCreateInbound, useInboundItems } from "../api/inbound.queries";

const SUPPLIERS = [
  "Vientiane Office Supplies Co., Ltd",
  "Phousy Construction & Trading",
  "Lao Tractor & Machinery",
  "Golden Mekong Logistics",
];

const REFS = ["PO-2026-009", "PO-2026-014", "PO-2026-020", "PO-2026-022"];

export function CreateInboundDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateInbound();
  const { data: catalog } = useInboundItems();
  const [purchaseOrderRef, setPurchaseOrderRef] = React.useState(REFS[0]);
  const [supplier, setSupplier] = React.useState(SUPPLIERS[0]);
  const [warehouse, setWarehouse] = React.useState(INBOUND_WAREHOUSES[0]);
  const [note, setNote] = React.useState("");
  const [lines, setLines] = React.useState<{ sku: string; qty: string }[]>([
    { sku: "", qty: "1" },
  ]);

  function addLine() {
    setLines((prev) => [...prev, { sku: "", qty: "1" }]);
  }

  async function submit() {
    const catalogItems = catalog ?? [];
    const parsedLines = lines
      .map((line) => {
        const item = catalogItems.find((entry) => entry.sku === line.sku);
        if (!item) return null;
        return {
          itemName: item.itemName,
          sku: item.sku,
          expected: Number(line.qty) || 1,
          unit: item.unit,
        };
      })
      .filter(
        (
          line
        ): line is {
          itemName: string;
          sku: string;
          expected: number;
          unit: string;
        } => Boolean(line)
      );
    if (parsedLines.length === 0) {
      toast.error("Choose at least one SKU (IN-004).");
      return;
    }
    try {
      await create.mutateAsync({
        purchaseOrderRef,
        supplier,
        warehouse,
        note,
        lines: parsedLines,
      });
      toast.success("Receiving order created (IN-001)");
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
          <DialogTitle>Create receiving order</DialogTitle>
          <DialogDescription>
            Create a receiving order against a purchase order (IN-001/002).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="in-po">Purchase order</Label>
              <Select
                value={purchaseOrderRef}
                onValueChange={(value) => setPurchaseOrderRef(value ?? REFS[0])}
              >
                <SelectTrigger id="in-po" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFS.map((ref) => (
                    <SelectItem key={ref} value={ref}>
                      {ref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="in-supplier">Supplier</Label>
              <Select
                value={supplier}
                onValueChange={(value) => setSupplier(value ?? SUPPLIERS[0])}
              >
                <SelectTrigger id="in-supplier" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIERS.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="in-wh">Receiving warehouse (WH-001)</Label>
            <Select
              value={warehouse}
              onValueChange={(value) =>
                setWarehouse(value ?? INBOUND_WAREHOUSES[0])
              }
            >
              <SelectTrigger id="in-wh" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INBOUND_WAREHOUSES.map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {entry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="in-note">Note</Label>
            <Input
              id="in-note"
              placeholder="Optional note…"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Expected lines (IN-005)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
              >
                <Plus />
                Add line
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
                  <SelectTrigger className="w-full" aria-label="Item SKU">
                    <SelectValue placeholder="Select item (IN-004)" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalog ?? []).map((item) => (
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
            Create order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
