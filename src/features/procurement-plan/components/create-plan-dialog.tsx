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
import { useCreatePlan, usePlanCategories } from "../api/plan.queries";

const DEPARTMENTS = [
  "Procurement",
  "Public Works",
  "Warehouse & Inventory",
  "Transport",
  "Executive Office",
  "Finance",
  "IT",
];

const DEFAULT_PLANNED_DATE = new Date(Date.now() + 30 * 86_400_000)
  .toISOString()
  .slice(0, 10);

export function CreatePlanDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreatePlan();
  const { data: categories } = usePlanCategories();
  const [title, setTitle] = React.useState("");
  const [department, setDepartment] = React.useState(DEPARTMENTS[0]);
  const [category, setCategory] = React.useState("");
  const [budget, setBudget] = React.useState("0");
  const [plannedDate, setPlannedDate] = React.useState(DEFAULT_PLANNED_DATE);
  const [items, setItems] = React.useState<
    { description: string; quantity: string; unitCost: string }[]
  >([{ description: "", quantity: "1", unitCost: "0" }]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { description: "", quantity: "1", unitCost: "0" },
    ]);
  }

  async function submit() {
    if (!title.trim()) {
      toast.error("A plan title is required.");
      return;
    }
    const parsedItems = items
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description.trim(),
        quantity: Number(item.quantity) || 1,
        estimatedCost: Number(item.unitCost) || 0,
      }));
    if (parsedItems.length === 0) {
      toast.error("Add at least one line item.");
      return;
    }
    const estimatedCost = parsedItems.reduce(
      (sum, item) => sum + item.quantity * item.estimatedCost,
      0
    );
    try {
      await create.mutateAsync({
        title,
        fiscalYear: "2026",
        department,
        category,
        budget: Number(budget) || estimatedCost,
        estimatedCost,
        plannedDate,
        items: parsedItems,
      });
      toast.success("Procurement plan created");
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
          <DialogTitle>Create procurement plan</DialogTitle>
          <DialogDescription>
            Draft a plan with a budget, planned purchase date, and line items
            (PLAN-001…007).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-title">Title</Label>
            <Input
              id="plan-title"
              placeholder="Annual Procurement Plan 2026"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="plan-dept">Department</Label>
              <Select
                value={department}
                onValueChange={(value) =>
                  setDepartment(value ?? DEPARTMENTS[0])
                }
              >
                <SelectTrigger id="plan-dept" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(DEPARTMENTS)].map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan-cat">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger id="plan-cat" className="w-full">
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
              <Label htmlFor="plan-date">Planned date</Label>
              <Input
                id="plan-date"
                type="date"
                value={plannedDate}
                onChange={(event) => setPlannedDate(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="plan-budget">Budget (LAK)</Label>
            <Input
              id="plan-budget"
              type="number"
              min={0}
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Line items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus />
                Add
              </Button>
            </div>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_70px_100px_auto]"
              >
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(event) =>
                    setItems((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, description: event.target.value }
                          : entry
                      )
                    )
                  }
                />
                <Input
                  aria-label="Quantity"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    setItems((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, quantity: event.target.value }
                          : entry
                      )
                    )
                  }
                />
                <Input
                  aria-label="Unit cost"
                  type="number"
                  min={0}
                  value={item.unitCost}
                  onChange={(event) =>
                    setItems((prev) =>
                      prev.map((entry, i) =>
                        i === index
                          ? { ...entry, unitCost: event.target.value }
                          : entry
                      )
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove item"
                  className="text-destructive"
                  onClick={() =>
                    setItems((prev) => prev.filter((_, i) => i !== index))
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
            Create plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
