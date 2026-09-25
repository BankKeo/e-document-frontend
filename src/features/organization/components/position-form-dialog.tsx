"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/features/auth/components/form-field";
import { positionSchema, type PositionInput } from "../schemas/organization.schemas";
import type { Position } from "../types";
import {
  useCreatePosition,
  useDepartmentsQuery,
  useUpdatePosition,
} from "../api/organization.queries";

export function PositionFormDialog({
  open,
  onOpenChange,
  position,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: Position | null;
}) {
  const isEdit = Boolean(position);
  const create = useCreatePosition();
  const update = useUpdatePosition();
  const { data: departments } = useDepartmentsQuery();

  const form = useForm<PositionInput>({
    resolver: zodResolver(positionSchema),
    defaultValues: { title: "", departmentId: "", grade: "", description: "" },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      position
        ? {
            title: position.title,
            departmentId: position.departmentId,
            grade: position.grade,
            description: position.description,
          }
        : { title: "", departmentId: "", grade: "", description: "" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, position]);

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: PositionInput) {
    try {
      if (position) {
        await update.mutateAsync({ id: position.id, input });
        toast.success(`${input.title} position updated`);
      } else {
        await create.mutateAsync(input);
        toast.success(`${input.title} position created`);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit position" : "Add position"}</DialogTitle>
          <DialogDescription>
            Positions define roles that employees can be assigned to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField id="title" label="Position title" error={form.formState.errors.title?.message}>
            {({ id, ...fieldProps }) => (
              <Input id={id} placeholder="Procurement Specialist" {...fieldProps} {...form.register("title")} />
            )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="departmentId" className="text-sm font-medium">
                Department
              </label>
              <Controller
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="departmentId" className="w-full" aria-invalid={Boolean(form.formState.errors.departmentId)}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.departmentId ? (
                <p className="text-sm text-destructive">{form.formState.errors.departmentId.message}</p>
              ) : null}
            </div>

            <FormField id="grade" label="Grade" error={form.formState.errors.grade?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="G4" {...fieldProps} {...form.register("grade")} />
              )}
            </FormField>
          </div>

          <FormField id="description" label="Description" hint="Optional" error={form.formState.errors.description?.message}>
            {({ id, ...fieldProps }) => (
              <Input id={id} {...fieldProps} {...form.register("description")} />
            )}
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {isEdit ? "Save changes" : "Create position"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}