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
import { useCreateAsset } from "../api/asset.queries";
import type { AssetCategory } from "../types";

const CATEGORIES: AssetCategory[] = [
  "Laptop",
  "Printer",
  "Vehicle",
  "Server",
  "Projector",
  "Furniture",
  "Tool",
];

export function RegisterAssetDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateAsset();
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<AssetCategory>("Laptop");
  const [location, setLocation] = React.useState("");
  const [purchaseValue, setPurchaseValue] = React.useState("0");
  const [depreciationRate, setDepreciationRate] = React.useState("20");

  async function submit() {
    if (!name.trim()) {
      toast.error("An asset name is required.");
      return;
    }
    try {
      await create.mutateAsync({
        name,
        category,
        location,
        custodian: "Available",
        purchaseValue: Number(purchaseValue) || 0,
        depreciationRate: Number(depreciationRate) || 0,
      });
      toast.success("Asset registered (ASSET-001)");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register asset</DialogTitle>
          <DialogDescription>
            Assign a tag, category, custodian, and depreciation rate
            (ASSET-001…010).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="asset-name">Name</Label>
              <Input
                id="asset-name"
                placeholder="Laptop — ThinkPad E14"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="asset-cat">Category (ASSET-003)</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory((value ?? "Laptop") as AssetCategory)
                }
              >
                <SelectTrigger id="asset-cat" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asset-loc">Location (ASSET-004)</Label>
            <Input
              id="asset-loc"
              placeholder="Warehouse Office"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="asset-value">Purchase value (LAK)</Label>
              <Input
                id="asset-value"
                type="number"
                min={0}
                value={purchaseValue}
                onChange={(event) => setPurchaseValue(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="asset-dep">
                Depreciation rate %/yr (ASSET-010)
              </Label>
              <Input
                id="asset-dep"
                type="number"
                min={0}
                max={100}
                value={depreciationRate}
                onChange={(event) => setDepreciationRate(event.target.value)}
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
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
