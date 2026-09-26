"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
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
import { FormField } from "@/features/auth/components/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateSupplier,
  useSupplierCategories,
  useSupplierCountries,
} from "../api/supplier.queries";

export function RegisterSupplierDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateSupplier();
  const { data: categories } = useSupplierCategories();
  const { data: countries } = useSupplierCountries();
  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [taxId, setTaxId] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  function toggle(category: string) {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  }

  async function submit() {
    if (!name.trim()) {
      setError("A supplier name is required.");
      return;
    }
    try {
      await create.mutateAsync({
        name,
        country,
        categories: selected,
        taxId: taxId.trim(),
      });
      toast.success("Supplier registered — status Submitted (SUP-003)");
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
          <DialogTitle>Register supplier</DialogTitle>
          <DialogDescription>
            Register a new supplier. It enters the lifecycle at Submitted and
            can be verified and approved later (SUP-001/003).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <FormField
            id="sup-name"
            label="Company name"
            error={error ?? undefined}
          >
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                placeholder="Vientiane Office Supplies Co., Ltd"
                value={name}
                onChange={(event) => setName(event.target.value)}
                {...fieldProps}
              />
            )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="sup-country">Country (SUP-004)</Label>
              <Select
                value={country}
                onValueChange={(value) => setCountry(value ?? "")}
              >
                <SelectTrigger id="sup-country" className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sup-tax">Tax ID</Label>
              <Input
                id="sup-tax"
                placeholder="002/2025/LA"
                value={taxId}
                onChange={(event) => setTaxId(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Categories (SUP-006)</Label>
            <div className="grid max-h-40 gap-1.5 overflow-y-auto">
              {categories?.map((category) => {
                const active = selected.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggle(category)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm ${active ? "border-primary bg-primary/5" : ""}`}
                  >
                    {category}
                    {active ? (
                      <Check className="size-3.5 text-primary" />
                    ) : null}
                  </button>
                );
              })}
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
