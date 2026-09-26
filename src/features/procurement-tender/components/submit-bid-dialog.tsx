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
import { useSubmitBid } from "../api/tender.queries";

const KNOWN_SUPPLIERS = [
  "Vientiane Office Supplies Co., Ltd",
  "Phousy Construction & Trading",
  "Lao Tractor & Machinery",
  "Golden Mekong Logistics",
  "TechNet Solutions",
];

export function SubmitBidDialog({
  tenderId,
  onOpenChange,
}: {
  tenderId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const submit = useSubmitBid();
  const [supplier, setSupplier] = React.useState(KNOWN_SUPPLIERS[0]);
  const [amount, setAmount] = React.useState("0");

  async function handleSubmit() {
    if (Number(amount) <= 0) {
      toast.error("Enter a valid bid amount.");
      return;
    }
    try {
      await submit.mutateAsync({
        id: tenderId,
        supplier,
        amount: Number(amount),
      });
      toast.success("Bid submitted (TENDER-009)");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit bid</DialogTitle>
          <DialogDescription>
            Record a supplier&apos;s offer for this tender (TENDER-009/010).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="bid-supplier">Supplier</Label>
            <select
              id="bid-supplier"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              value={supplier}
              onChange={(event) => setSupplier(event.target.value)}
            >
              {KNOWN_SUPPLIERS.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bid-amount">Bid amount (LAK)</Label>
            <Input
              id="bid-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submit.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submit.isPending}>
            {submit.isPending && <Loader2 className="animate-spin" />}
            Submit bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
