"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/features/auth/components/form-field";
import {
  createUserSchema,
  editUserSchema,
  type CreateUserInput,
  type EditUserInput,
} from "../schemas/user.schema";
import type { User } from "../types";
import {
  useCreateUser,
  useDepartments,
  useRoles,
  useUpdateUser,
} from "../api/user.queries";

interface UserFormValues {
  name: string;
  email?: string;
  title?: string;
  role: string;
  department: string;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}) {
  const isEdit = Boolean(user);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: roles, isPending: rolesPending } = useRoles();
  const { data: departments, isPending: departmentsPending } = useDepartments();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(user ? editUserSchema : createUserSchema),
    defaultValues: user
      ? {
          name: user.name,
          title: user.title,
          role: user.role,
          department: user.department,
        }
      : { name: "", email: "", title: "", role: "", department: "" },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      user
        ? { name: user.name, title: user.title, role: user.role, department: user.department }
        : { name: "", email: "", title: "", role: "", department: "" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const submitting = createUser.isPending || updateUser.isPending;

  async function onSubmit(input: UserFormValues) {
    try {
      if (user) {
        await updateUser.mutateAsync({ id: user.id, input: input as EditUserInput });
        toast.success(`${input.name} updated`);
      } else {
        await createUser.mutateAsync(input as CreateUserInput);
        toast.success(`${input.name} created`);
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
          <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update profile details. Email addresses cannot be changed."
              : "Create an account and grant access to the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField id="name" label="Full name" error={form.formState.errors.name?.message}>
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                autoComplete="off"
                placeholder="Jane Doe"
                {...fieldProps}
                {...form.register("name")}
              />
            )}
          </FormField>

          {!user ? (
            <FormField id="email" label="Email" error={form.formState.errors.email?.message}>
              {({ id, ...fieldProps }) => (
                <Input
                  id={id}
                  type="email"
                  autoComplete="off"
                  placeholder="jane@example.gov"
                  {...fieldProps}
                  {...form.register("email")}
                />
              )}
            </FormField>
          ) : (
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" value={user.email} disabled />
            </div>
          )}

          <FormField id="title" label="Job title" hint="Optional" error={form.formState.errors.title?.message}>
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                autoComplete="off"
                placeholder="Senior Analyst"
                {...fieldProps}
                {...form.register("title")}
              />
            )}
          </FormField>

          <div className="grid gap-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="role"
                    className="w-full"
                    aria-invalid={Boolean(form.formState.errors.role)}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesPending ? null : (
                      roles?.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.role ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.role.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label htmlFor="department" className="text-sm font-medium">
              Department
            </label>
            <Controller
              control={form.control}
              name="department"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="department"
                    className="w-full"
                    aria-invalid={Boolean(form.formState.errors.department)}
                  >
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentsPending ? null : (
                      departments?.map((department) => (
                        <SelectItem key={department.id} value={department.name}>
                          {department.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.department ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.department.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {isEdit ? "Save changes" : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}