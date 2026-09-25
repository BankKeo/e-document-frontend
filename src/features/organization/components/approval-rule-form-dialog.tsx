"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/features/auth/components/form-field";
import {
  approvalRuleSchema,
  type ApprovalRuleInput,
} from "../schemas/organization.schemas";
import type { ApprovalModule, ApprovalRule } from "../types";
import {
  useApprovers,
  useCreateApprovalRule,
  useDocumentTypes,
  useUpdateApprovalRule,
} from "../api/organization.queries";

export function ApprovalRuleFormDialog({
  open,
  onOpenChange,
  rule,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: ApprovalRule | null;
}) {
  const isEdit = Boolean(rule);
  const create = useCreateApprovalRule();
  const update = useUpdateApprovalRule();
  const { data: documentTypes } = useDocumentTypes();
  const { data: approvers } = useApprovers();

  const form = useForm<ApprovalRuleInput>({
    resolver: zodResolver(approvalRuleSchema) as Resolver<ApprovalRuleInput>,
    defaultValues: {
      documentType: "",
      module: "Procurement",
      limitKind: "any",
      minAmount: 0,
      maxAmount: undefined,
      level: 1,
      approver: "",
      alternateApprover: "",
      enabled: true,
    },
  });

  const limitKind = useWatch({ control: form.control, name: "limitKind" });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      rule
        ? {
            documentType: rule.documentType,
            module: rule.module,
            limitKind: rule.limitKind,
            minAmount: rule.minAmount ?? 0,
            maxAmount: rule.maxAmount,
            level: rule.level,
            approver: rule.approver,
            alternateApprover: rule.alternateApprover,
            enabled: rule.enabled,
          }
        : {
            documentType: "",
            module: "Procurement",
            limitKind: "any",
            minAmount: 0,
            maxAmount: undefined,
            level: 1,
            approver: "",
            alternateApprover: "",
            enabled: true,
          }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, rule]);

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: ApprovalRuleInput) {
    try {
      const normalized: ApprovalRuleInput =
        input.limitKind === "any"
          ? { ...input, minAmount: undefined, maxAmount: undefined }
          : input;
      if (rule) {
        await update.mutateAsync({ id: rule.id, input: normalized });
        toast.success("Approval rule updated");
      } else {
        await create.mutateAsync(normalized);
        toast.success("Approval rule added");
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
          <DialogTitle>{isEdit ? "Edit approval rule" : "Add approval rule"}</DialogTitle>
          <DialogDescription>
            Define who approves each document type and amount tier.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="documentType" className="text-sm font-medium">
                Document type
              </label>
              <Controller
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="documentType" className="w-full" aria-invalid={Boolean(form.formState.errors.documentType)}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.documentType ? (
                <p className="text-sm text-destructive">{form.formState.errors.documentType.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="module" className="text-sm font-medium">
                Module
              </label>
              <Controller
                control={form.control}
                name="module"
                render={({ field }) => (
                  <Select value={field.value as ApprovalModule} onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger id="module" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Procurement">Procurement</SelectItem>
                      <SelectItem value="DMS">DMS</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="limitKind" className="justify-self-start gap-2 text-muted-foreground">
              <Controller
                control={form.control}
                name="limitKind"
                render={({ field }) => (
                  <Checkbox
                    id="limitKind"
                    checked={field.value === "amount"}
                    onCheckedChange={(checked) => field.onChange(checked ? "amount" : "any")}
                  />
                )}
              />
              Limit by amount
            </Label>
          </div>

          {limitKind === "amount" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="minAmount" label="Minimum (LAK)" error={form.formState.errors.minAmount?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} type="number" placeholder="0" {...fieldProps} {...form.register("minAmount")} />
                )}
              </FormField>
              <FormField id="maxAmount" label="Maximum (LAK)" hint="Leave empty for no upper limit" error={form.formState.errors.maxAmount?.message}>
                {({ id, ...fieldProps }) => (
                  <Input id={id} type="number" placeholder="Unlimited" {...fieldProps} {...form.register("maxAmount")} />
                )}
              </FormField>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Applies to documents of any amount.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="level" label="Approval level" error={form.formState.errors.level?.message}>
              {({ id, ...fieldProps }) => (
                <Input id={id} type="number" min={1} max={5} {...fieldProps} {...form.register("level")} />
              )}
            </FormField>

            <div className="grid gap-2">
              <label htmlFor="approver" className="text-sm font-medium">
                Approver
              </label>
              <Controller
                control={form.control}
                name="approver"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="approver" className="w-full" aria-invalid={Boolean(form.formState.errors.approver)}>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers?.map((approver) => (
                        <SelectItem key={approver} value={approver}>
                          {approver}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.approver ? (
                <p className="text-sm text-destructive">{form.formState.errors.approver.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="alternateApprover" className="text-sm font-medium">
              Alternate approver
            </label>
            <Controller
              control={form.control}
              name="alternateApprover"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="alternateApprover" className="w-full" aria-invalid={Boolean(form.formState.errors.alternateApprover)}>
                    <SelectValue placeholder="Select alternate" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvers?.map((approver) => (
                      <SelectItem key={approver} value={approver}>
                        {approver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.alternateApprover ? (
              <p className="text-sm text-destructive">{form.formState.errors.alternateApprover.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="enabled" className="justify-self-start gap-2 text-muted-foreground">
              <Controller
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <Checkbox
                    id="enabled"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                  />
                )}
              />
              Rule is active
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {isEdit ? "Save changes" : "Add rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}