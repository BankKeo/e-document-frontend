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
import {
  useCreateRequisition,
  useRequisitionCategories,
  useRequisitionUnits,
} from "../api/requisition.queries";

const DEPARTMENTS = [
  "Executive Office",
  "Procurement",
  "Public Works",
  "Warehouse & Inventory",
  "Finance",
  "IT",
];

const DEFAULT_REQUIRED_DATE = new Date(Date.now() + 14 * 86_400_000)
  .toISOString()
  .slice(0, 10);

export function CreateRequisitionDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateRequisition();
  const { data: categories } = useRequisitionCategories();
  const { data: units } = useRequisitionUnits();
  const [title, setTitle] = React.useState("");
  const [department, setDepartment] = React.useState(DEPARTMENTS[0]);
  const [category, setCategory] = React.useState("");
  const [items, setItems] = React.useState<
    {
      description: string;
      spec: string;
      quantity: string;
      unit: string;
      price: string;
      requiredDate: string;
    }[]
  >([
    {
      description: "",
      spec: "",
      quantity: "1",
      unit: "unit",
      price: "0",
      requiredDate: DEFAULT_REQUIRED_DATE,
    },
  ]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        spec: "",
        quantity: "1",
        unit: "unit",
        price: "0",
        requiredDate: DEFAULT_REQUIRED_DATE,
      },
    ]);
  }

  async function submit() {
    if (!title.trim()) {
      toast.error("A requisition title is required.");
      return;
    }
    const parsedItems = items
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description.trim(),
        spec: item.spec.trim(),
        quantity: Number(item.quantity) || 1,
        unit: item.unit || "unit",
        estimatedPrice: Number(item.price) || 0,
        requiredDate: item.requiredDate,
      }));
    if (parsedItems.length === 0) {
      toast.error("Add at least one item (PR-002).");
      return;
    }
    try {
      await create.mutateAsync({
        title,
        department,
        category,
        items: parsedItems,
      });
      toast.success("Purchase requisition created");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create purchase requisition</DialogTitle>
          <DialogDescription>
            Add items with specifications, quantities, estimated prices, and
            required dates (PR-001…007).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pr-title">Title</Label>
            <Input
              id="pr-title"
              placeholder="Office supplies — stationery pack"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pr-dept">Department</Label>
              <Select
                value={department}
                onValueChange={(value) =>
                  setDepartment(value ?? DEPARTMENTS[0])
                }
              >
                <SelectTrigger id="pr-dept" className="w-full">
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
              <Label htmlFor="pr-cat">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger id="pr-cat" className="w-full">
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
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Items (PR-002…006)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus />
                Add item
              </Button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-lg border p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
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
                    aria-label="Specification"
                    placeholder="Specification (PR-003)"
                    value={item.spec}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((entry, i) =>
                          i === index
                            ? { ...entry, spec: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-4">
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
                  <Select
                    value={item.unit}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((entry, i) =>
                          i === index
                            ? { ...entry, unit: value ?? "unit" }
                            : entry
                        )
                      )
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units?.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    aria-label="Estimated price"
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((entry, i) =>
                          i === index
                            ? { ...entry, price: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <Input
                    aria-label="Required date"
                    type="date"
                    value={item.requiredDate}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((entry, i) =>
                          i === index
                            ? { ...entry, requiredDate: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() =>
                      setItems((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 />
                    Remove
                  </Button>
                </div>
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
            Create requisition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
