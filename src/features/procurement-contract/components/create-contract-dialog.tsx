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
import { useContractTypes, useCreateContract } from "../api/contract.queries";

const SUPPLIERS = [
  "Vientiane Office Supplies Co., Ltd",
  "Phousy Construction & Trading",
  "Lao Tractor & Machinery",
  "Golden Mekong Logistics",
  "TechNet Solutions",
];

const DEFAULT_START = new Date(Date.now()).toISOString().slice(0, 10);

export function CreateContractDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateContract();
  const { data: types } = useContractTypes();
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("");
  const [supplier, setSupplier] = React.useState(SUPPLIERS[0]);
  const [value, setValue] = React.useState("0");
  const [startDate, setStartDate] = React.useState(DEFAULT_START);
  const [endDate, setEndDate] = React.useState(DEFAULT_START);

  async function submit() {
    if (!title.trim()) {
      toast.error("A contract title is required.");
      return;
    }
    if (endDate <= startDate) {
      toast.error("End date must be after start date.");
      return;
    }
    try {
      await create.mutateAsync({
        title,
        type,
        supplier,
        value: Number(value) || 0,
        startDate,
        endDate,
      });
      toast.success("Contract created (CON-001)");
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
          <DialogTitle>Create contract</DialogTitle>
          <DialogDescription>
            Create a new draft contract with supplier, value, and term
            (CON-001…008).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contract-title">Title</Label>
            <Input
              id="contract-title"
              placeholder="Framework Contract — Office Supplies"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contract-type">Type (CON-003)</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value ?? "")}
              >
                <SelectTrigger id="contract-type" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {types?.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contract-supplier">Supplier (CON-004)</Label>
              <Select
                value={supplier}
                onValueChange={(value) => setSupplier(value ?? SUPPLIERS[0])}
              >
                <SelectTrigger id="contract-supplier" className="w-full">
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
            <Label htmlFor="contract-value">Value (LAK)</Label>
            <Input
              id="contract-value"
              type="number"
              min={0}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contract-start">Start date (CON-006)</Label>
              <Input
                id="contract-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contract-end">End date (CON-007)</Label>
              <Input
                id="contract-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
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
            Create contract
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
