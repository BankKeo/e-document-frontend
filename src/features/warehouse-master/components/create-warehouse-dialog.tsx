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
import { useCreateWarehouse } from "../api/warehouse.queries";

export function CreateWarehouseDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateWarehouse();
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [capacity, setCapacity] = React.useState("10000");
  const [staff, setStaff] = React.useState("0");

  async function submit() {
    if (!name.trim()) {
      toast.error("A warehouse name is required.");
      return;
    }
    try {
      await create.mutateAsync({
        name,
        location,
        capacity: Number(capacity) || 0,
        staff: Number(staff) || 0,
      });
      toast.success("Warehouse created (WH-001)");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create warehouse</DialogTitle>
          <DialogDescription>
            Set capacity, location, and staff for a new warehouse (WH-001…008).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="wh-name">Name</Label>
            <Input
              id="wh-name"
              placeholder="Central Warehouse — Vientiane"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wh-location">Location (WH-002)</Label>
            <Input
              id="wh-location"
              placeholder="Address"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="wh-capacity">Capacity (WH-007)</Label>
              <Input
                id="wh-capacity"
                type="number"
                min={0}
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wh-staff">Staff (WH-008)</Label>
              <Input
                id="wh-staff"
                type="number"
                min={0}
                value={staff}
                onChange={(event) => setStaff(event.target.value)}
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
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
