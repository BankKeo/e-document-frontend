"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { employeeSchema, type EmployeeInput } from "../schemas/organization.schemas";
import type { Employee } from "../types";
import {
  useCreateEmployee,
  useDepartmentsQuery,
  useEmployeesQuery,
  usePositionsQuery,
  useUpdateEmployee,
} from "../api/organization.queries";

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
}) {
  const isEdit = Boolean(employee);
  const create = useCreateEmployee();
  const update = useUpdateEmployee();
  const { data: departments } = useDepartmentsQuery();
  const { data: positions } = usePositionsQuery();
  const { data: employees } = useEmployeesQuery();

  const form = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeCode: "",
      name: "",
      email: "",
      departmentId: "",
      positionId: "",
      managerId: null,
      employmentType: "Permanent",
      joinedAt: "",
      phone: "",
    },
  });

  const selectedDepartment = useWatch({
    control: form.control,
    name: "departmentId",
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      employee
        ? {
            employeeCode: employee.employeeCode,
            name: employee.name,
            email: employee.email,
            departmentId: employee.departmentId,
            positionId: employee.positionId,
            managerId: employee.managerId,
            employmentType: employee.employmentType,
            joinedAt: employee.joinedAt,
            phone: employee.phone ?? "",
          }
        : {
            employeeCode: "",
            name: "",
            email: "",
            departmentId: "",
            positionId: "",
            managerId: null,
            employmentType: "Permanent",
            joinedAt: "",
            phone: "",
          }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employee]);

  const filteredPositions = React.useMemo(
    () =>
      (positions ?? []).filter(
        (position) =>
          !selectedDepartment || position.departmentId === selectedDepartment
      ),
    [positions, selectedDepartment]
  );

  const eligibilityOptions = (employees ?? []).filter(
    (entry) => entry.id !== employee?.id
  );

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: EmployeeInput) {
    try {
      if (employee) {
        await update.mutateAsync({ id: employee.id, input });
        toast.success(`${input.name} updated`);
      } else {
        await create.mutateAsync(input);
        toast.success(`${input.name} added`);
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
          <DialogDescription>
            Employees link to a department, position, and reporting manager.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="employeeCode" label="Employee code" error={form.formState.errors.employeeCode?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="EMP-017" {...fieldProps} {...form.register("employeeCode")} />
              )}
            </FormField>
            <FormField id="name" label="Full name" error={form.formState.errors.name?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="Jane Doe" {...fieldProps} {...form.register("name")} />
              )}
            </FormField>
          </div>

          <FormField id="email" label="Email" error={form.formState.errors.email?.message}>
            {({ id, ...fieldProps }) => (
              <Input id={id} type="email" placeholder="jane@acme.gov" {...fieldProps} {...form.register("email")} />
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      const current = form.getValues("positionId");
                      const stillValid = (positions ?? []).some(
                        (position) =>
                          position.id === current && position.departmentId === value
                      );
                      if (current && !stillValid) form.setValue("positionId", "");
                    }}
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

            <div className="grid gap-2">
              <label htmlFor="positionId" className="text-sm font-medium">
                Position
              </label>
              <Controller
                control={form.control}
                name="positionId"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="positionId" className="w-full" aria-invalid={Boolean(form.formState.errors.positionId)}>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPositions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.positionId ? (
                <p className="text-sm text-destructive">{form.formState.errors.positionId.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <label htmlFor="managerId" className="text-sm font-medium">
                Reports to
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
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibilityOptions.map((entry) => (
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
              <label htmlFor="employmentType" className="text-sm font-medium">
                Employment type
              </label>
              <Controller
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="employmentType" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <FormField id="joinedAt" label="Joined" error={form.formState.errors.joinedAt?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} type="date" {...fieldProps} {...form.register("joinedAt")} />
              )}
            </FormField>
          </div>

          <FormField id="phone" label="Phone" hint="Optional" error={form.formState.errors.phone?.message}>
            {({ id, ...fieldProps }) => (
              <Input id={id} placeholder="+856 20 …" {...fieldProps} {...form.register("phone")} />
            )}
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {isEdit ? "Save changes" : "Add employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}