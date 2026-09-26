"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
import { MOCK_PO_REFS } from "../mock/data";
import { useCreateDelivery } from "../api/delivery.queries";

const SUPPLIERS = [
  "Vientiane Office Supplies Co., Ltd",
  "Phousy Construction & Trading",
  "Lao Tractor & Machinery",
  "Golden Mekong Logistics",
  "TechNet Solutions",
];

const DEFAULT_SCHEDULED = new Date(Date.now() + 7 * 86_400_000)
  .toISOString()
  .slice(0, 10);

export function CreateDeliveryDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateDelivery();
  const [purchaseOrderRef, setPurchaseOrderRef] = React.useState(
    MOCK_PO_REFS[0]
  );
  const [supplier, setSupplier] = React.useState(SUPPLIERS[0]);
  const [scheduledDate, setScheduledDate] = React.useState(DEFAULT_SCHEDULED);
  const [note, setNote] = React.useState("");
  const [lines, setLines] = React.useState<
    { item: string; qty: string; unit: string }[]
  >([{ item: "", qty: "1", unit: "unit" }]);

  function addLine() {
    setLines((prev) => [...prev, { item: "", qty: "1", unit: "unit" }]);
  }

  async function submit() {
    const parsedLines = lines
      .filter((line) => line.item.trim())
      .map((line) => ({
        item: line.item.trim(),
        expectedQty: Number(line.qty) || 1,
        unit: line.unit || "unit",
      }));
    if (parsedLines.length === 0) {
      toast.error("Add at least one delivery line (DEL-005).");
      return;
    }
    try {
      await create.mutateAsync({
        purchaseOrderRef,
        supplier,
        scheduledDate,
        note,
        lines: parsedLines,
      });
      toast.success("Delivery scheduled (DEL-001)");
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
          <DialogTitle>Schedule delivery</DialogTitle>
          <DialogDescription>
            Create a delivery against a purchase order (DEL-001…003).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="del-po">Purchase order (DEL-002)</Label>
              <Select
                value={purchaseOrderRef}
                onValueChange={(value) =>
                  setPurchaseOrderRef(value ?? MOCK_PO_REFS[0])
                }
              >
                <SelectTrigger id="del-po" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PO_REFS.map((ref) => (
                    <SelectItem key={ref} value={ref}>
                      {ref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="del-supplier">Supplier (DEL-004)</Label>
              <Select
                value={supplier}
                onValueChange={(value) => setSupplier(value ?? SUPPLIERS[0])}
              >
                <SelectTrigger id="del-supplier" className="w-full">
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
            <Label htmlFor="del-date">Scheduled date (DEL-002)</Label>
            <Input
              id="del-date"
              type="date"
              value={scheduledDate}
              onChange={(event) => setScheduledDate(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="del-note">Note</Label>
            <Input
              id="del-note"
              placeholder="Shipping note…"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Expected items (DEL-005)</Label>
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
                className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_80px_80px_auto]"
              >
                <Input
                  placeholder="Item"
                  value={line.item}
                  onChange={(event) =>
                    setLines((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, item: event.target.value }
                          : entry
                      )
                    )
                  }
                />
                <Input
                  aria-label="Expected quantity"
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
                <Input
                  aria-label="Unit"
                  placeholder="unit"
                  value={line.unit}
                  onChange={(event) =>
                    setLines((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, unit: event.target.value }
                          : entry
                      )
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove line"
                  className="text-destructive"
                  onClick={() =>
                    setLines((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 />
                </Button>
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
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
