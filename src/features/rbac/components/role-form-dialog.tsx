"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { FormField } from "@/features/auth/components/form-field";
import { roleSchema, type RoleInput } from "../schemas/rbac.schemas";
import type { Role } from "../types";
import { useCreateRole, useUpdateRole } from "../api/rbac.queries";

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}) {
  const isEdit = Boolean(role);
  const create = useCreateRole();
  const update = useUpdateRole();

  const form = useForm<RoleInput>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      role
        ? {
            name: role.name,
            code: role.code,
            description: role.description,
          }
        : { name: "", code: "", description: "" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, role]);

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: RoleInput) {
    try {
      if (role) {
        await update.mutateAsync({ id: role.id, input });
        toast.success(`${input.name} role updated`);
      } else {
        await create.mutateAsync(input);
        toast.success(`${input.name} role created`);
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
          <DialogTitle>{isEdit ? "Edit role" : "Create role"}</DialogTitle>
          <DialogDescription>
            Roles bundle permissions, department access, and a data level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="name" label="Role name" error={form.formState.errors.name?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="Compliance Officer" {...fieldProps} {...form.register("name")} />
              )}
            </FormField>
            <FormField id="code" label="Code" error={form.formState.errors.code?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} placeholder="COMPLIANCE" {...fieldProps} {...form.register("code")} />
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
              {isEdit ? "Save changes" : "Create role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}