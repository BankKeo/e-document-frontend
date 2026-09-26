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
import { MOCK_OUTBOUND_WAREHOUSES } from "../mock/data";
import { useCreateOutbound, useOutboundLines } from "../api/outbound.queries";

const DEPARTMENTS = [
  "Executive Office",
  "Finance",
  "IT",
  "Procurement",
  "Public Works",
  "Warehouse & Inventory",
];

export function CreateOutboundDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateOutbound();
  const { data: catalog } = useOutboundLines();
  const [department, setDepartment] = React.useState(DEPARTMENTS[0]);
  const [requester, setRequester] = React.useState("Malina Phetxomphou");
  const [warehouse, setWarehouse] = React.useState(MOCK_OUTBOUND_WAREHOUSES[0]);
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
      toast.error("Choose at least one item (OUT-001).");
      return;
    }
    try {
      await create.mutateAsync({
        department,
        requester,
        warehouse,
        lines: parsedLines,
      });
      toast.success("Issue request created (OUT-001/002)");
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
          <DialogTitle>New issue request</DialogTitle>
          <DialogDescription>
            Departments request stock; warehouse approves, picks, packs, and
            issues (OUT-001…010).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="out-dept">Department</Label>
              <Select
                value={department}
                onValueChange={(value) =>
                  setDepartment(value ?? DEPARTMENTS[0])
                }
              >
                <SelectTrigger id="out-dept" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="out-requester">Requester</Label>
              <Input
                id="out-requester"
                value={requester}
                onChange={(event) => setRequester(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="out-wh">Warehouse</Label>
            <Select
              value={warehouse}
              onValueChange={(value) =>
                setWarehouse(value ?? MOCK_OUTBOUND_WAREHOUSES[0])
              }
            >
              <SelectTrigger id="out-wh" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_OUTBOUND_WAREHOUSES.map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {entry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Create request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
