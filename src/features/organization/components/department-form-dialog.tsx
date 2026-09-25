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
import { departmentSchema, type DepartmentInput } from "../schemas/organization.schemas";
import type { Department } from "../types";
import {
  useCreateDepartment,
  useDepartmentsQuery,
  useEmployeesQuery,
  useUpdateDepartment,
} from "../api/organization.queries";

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
}) {
  const isEdit = Boolean(department);
  const create = useCreateDepartment();
  const update = useUpdateDepartment();
  const { data: departments } = useDepartmentsQuery();
  const { data: employees } = useEmployeesQuery();

  const form = useForm<DepartmentInput>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      parentId: null,
      managerId: null,
      description: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      department
        ? {
            name: department.name,
            code: department.code,
            parentId: department.parentId,
            managerId: department.managerId,
            description: department.description,
          }
        : { name: "", code: "", parentId: null, managerId: null, description: "" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, department]);

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: DepartmentInput) {
    try {
      if (department) {
        await update.mutateAsync({ id: department.id, input });
        toast.success(`${input.name} department updated`);
      } else {
        await create.mutateAsync(input);
        toast.success(`${input.name} department created`);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  const parentOptions = (departments ?? []).filter((entry) => entry.id !== department?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit department" : "Add department"}</DialogTitle>
          <DialogDescription>
            Departments are the primary grouping used across documents and reports.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="name" label="Name" error={form.formState.errors.name?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="Procurement" {...fieldProps} {...form.register("name")} />
              )}
            </FormField>
            <FormField id="code" label="Code" error={form.formState.errors.code?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="PROC" {...fieldProps} {...form.register("code")} />
              )}
            </FormField>
          </div>

          <div className="grid gap-2">
            <label htmlFor="parentId" className="text-sm font-medium">
              Parent department
            </label>
            <Controller
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={(value) => field.onChange(value ?? null)}
                >
                  <SelectTrigger id="parentId" className="w-full">
                    <SelectValue placeholder="None (top level)" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="managerId" className="text-sm font-medium">
              Head of department
            </label>
            <Controller
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={(value) => field.onChange(value ?? null)}
                >
                  <SelectTrigger id="managerId" className="w-full">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
              {isEdit ? "Save changes" : "Create department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}