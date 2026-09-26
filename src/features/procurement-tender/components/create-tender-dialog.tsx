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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTender, useTenderCategories } from "../api/tender.queries";

export function CreateTenderDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateTender();
  const { data: categories } = useTenderCategories();
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [estimatedValue, setEstimatedValue] = React.useState("0");

  async function submit() {
    if (!title.trim()) {
      toast.error("A tender title is required.");
      return;
    }
    try {
      await create.mutateAsync({
        title,
        category,
        description,
        estimatedValue: Number(estimatedValue) || 0,
      });
      toast.success("Tender created (TENDER-001)");
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
          <DialogTitle>Create tender</DialogTitle>
          <DialogDescription>
            Create a draft tender with specification and estimated value
            (TENDER-001…004).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tender-title">Title</Label>
            <Input
              id="tender-title"
              placeholder="Supply of Office Furniture"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tender-cat">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger id="tender-cat" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tender-value">Estimated value (LAK)</Label>
              <Input
                id="tender-value"
                type="number"
                min={0}
                value={estimatedValue}
                onChange={(event) => setEstimatedValue(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tender-desc">Description</Label>
            <Textarea
              id="tender-desc"
              rows={3}
              placeholder="Scope and deliverables…"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
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
            Create tender
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
