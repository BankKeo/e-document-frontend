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
import { useScoreBid } from "../api/tender.queries";
import type { TenderBid } from "../types";

export function ScoreBidDialog({
  tenderId,
  bid,
  onOpenChange,
}: {
  tenderId: string;
  bid: TenderBid;
  onOpenChange: (open: boolean) => void;
}) {
  const score = useScoreBid();
  const [technical, setTechnical] = React.useState(
    String(bid.technicalScore ?? 80)
  );
  const [financial, setFinancial] = React.useState(
    String(bid.financialScore ?? 80)
  );

  async function submit() {
    try {
      await score.mutateAsync({
        id: tenderId,
        bidId: bid.id,
        technicalScore: Number(technical) || 0,
        financialScore: Number(financial) || 0,
      });
      toast.success("Bid scored (TENDER-012/013)");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to score.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Score bid — {bid.supplier}</DialogTitle>
          <DialogDescription>
            Technical and financial scores are weighted 60/40 into a total score
            (TENDER-014).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tech-score">Technical score (0–100)</Label>
            <Input
              id="tech-score"
              type="number"
              min={0}
              max={100}
              value={technical}
              onChange={(event) => setTechnical(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fin-score">Financial score (0–100)</Label>
            <Input
              id="fin-score"
              type="number"
              min={0}
              max={100}
              value={financial}
              onChange={(event) => setFinancial(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={score.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={score.isPending}>
            {score.isPending && <Loader2 className="animate-spin" />}
            Save score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
