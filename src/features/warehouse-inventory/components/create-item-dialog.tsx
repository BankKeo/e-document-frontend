"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { MOCK_ITEM_CATEGORIES } from "../mock/data";
import { useCreateInventoryItem } from "../api/inventory.queries";

const UNITS = ["unit", "ream", "box", "ton", "litre", "m³"];

export function CreateItemDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateInventoryItem();
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Office Supplies");
  const [unit, setUnit] = React.useState("unit");
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [minStock, setMinStock] = React.useState("0");
  const [maxStock, setMaxStock] = React.useState("100");
  const [reorderPoint, setReorderPoint] = React.useState("10");

  async function submit() {
    if (!name.trim()) {
      toast.error("An item name is required.");
      return;
    }
    try {
      await create.mutateAsync({
        name,
        category,
        unit,
        brand,
        model,
        minStock: Number(minStock) || 0,
        maxStock: Number(maxStock) || 100,
        reorderPoint: Number(reorderPoint) || 0,
      });
      toast.success("Item created (ITEM-001)");
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
          <DialogTitle>Create item</DialogTitle>
          <DialogDescription>
            Add to the product master with SKU, category, unit, and stock levels
            (ITEM-001…012).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="item-name">Item name</Label>
              <Input
                id="item-name"
                placeholder="Paper A4 80gsm"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-cat">Category (ITEM-004)</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "Other")}
              >
                <SelectTrigger id="item-cat" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ITEM_CATEGORIES.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="item-unit">Unit (ITEM-005)</Label>
              <Select
                value={unit}
                onValueChange={(value) => setUnit(value ?? "unit")}
              >
                <SelectTrigger id="item-unit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-brand">Brand (ITEM-006)</Label>
              <Input
                id="item-brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-model">Model (ITEM-007)</Label>
              <Input
                id="item-model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="item-min">Min stock (ITEM-009)</Label>
              <Input
                id="item-min"
                type="number"
                min={0}
                value={minStock}
                onChange={(event) => setMinStock(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-max">Max stock (ITEM-010)</Label>
              <Input
                id="item-max"
                type="number"
                min={0}
                value={maxStock}
                onChange={(event) => setMaxStock(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-reorder">Reorder pt. (ITEM-011)</Label>
              <Input
                id="item-reorder"
                type="number"
                min={0}
                value={reorderPoint}
                onChange={(event) => setReorderPoint(event.target.value)}
              />
            </div>
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
            Create item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
