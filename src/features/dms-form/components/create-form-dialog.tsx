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
import { FormField } from "@/features/auth/components/form-field";
import { useCreateForm } from "../api/form.queries";

export function CreateFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateForm();
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    if (!name.trim()) {
      setError("A form name is required.");
      return;
    }
    try {
      await create.mutateAsync({
        name,
        description,
        category: category.trim() || "General",
        fields: [{ type: "Text", label: "First field", required: false }],
      });
      toast.success("Form created");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Start a new e-form template. You will design its fields in the
            builder.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <FormField id="form-name" label="Name" error={error ?? undefined}>
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                placeholder="Stationery Request"
                value={name}
                onChange={(event) => setName(event.target.value)}
                {...fieldProps}
              />
            )}
          </FormField>
          <div className="grid gap-2">
            <Label htmlFor="form-category">Category</Label>
            <Input
              id="form-category"
              placeholder="Warehouse, HR, IT…"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              rows={2}
              placeholder="What is this form used for?"
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
            Create form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
