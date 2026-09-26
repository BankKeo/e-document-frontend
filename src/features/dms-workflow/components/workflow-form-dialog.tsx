"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/features/auth/components/form-field";
import {
  workflowFormSchema,
  type WorkflowFormInput,
} from "../schemas/workflow.schemas";
import type { WorkflowDefinition, WorkflowNodeType } from "../types";
import {
  useCreateWorkflow,
  useUpdateWorkflow,
  useWorkflowCategories,
} from "../api/workflow.queries";

const NODE_TYPES: WorkflowNodeType[] = [
  "Start",
  "Approval",
  "Review",
  "Conditional",
  "Parallel",
  "Notification",
  "End",
];

export function WorkflowFormDialog({
  open,
  onOpenChange,
  workflow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow?: WorkflowDefinition | null;
}) {
  const isEdit = Boolean(workflow);
  const create = useCreateWorkflow();
  const update = useUpdateWorkflow();
  const { data: categories } = useWorkflowCategories();

  const form = useForm<WorkflowFormInput>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      nodes: [
        { type: "Start", title: "Start", description: "", assignee: "" },
        { type: "Approval", title: "Approval", description: "", assignee: "" },
        { type: "End", title: "End", description: "", assignee: "" },
      ],
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: "nodes",
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      workflow
        ? {
            name: workflow.name,
            category: workflow.category,
            description: workflow.description,
            nodes: workflow.nodes.map((node) => ({
              type: node.type,
              title: node.title,
              description: node.description ?? "",
              assignee: node.assignee ?? "",
            })),
          }
        : {
            name: "",
            category: "",
            description: "",
            nodes: [
              { type: "Start", title: "Start", description: "", assignee: "" },
              {
                type: "Approval",
                title: "Approval",
                description: "",
                assignee: "",
              },
              { type: "End", title: "End", description: "", assignee: "" },
            ],
          }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, workflow]);

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: WorkflowFormInput) {
    try {
      const nodes = input.nodes.map((node) => ({
        type: node.type,
        title: node.title,
        description: node.description,
        assignee: node.assignee,
      }));
      if (workflow) {
        await update.mutateAsync({
          id: workflow.id,
          input: { ...input, nodes },
        });
        toast.success("Workflow updated");
      } else {
        await create.mutateAsync(input);
        toast.success("Workflow created");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit workflow" : "Create workflow"}
          </DialogTitle>
          <DialogDescription>
            Define the name, category, and the ordered sequence of nodes from
            start to end.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          <FormField
            id="wf-name"
            label="Name"
            error={form.formState.errors.name?.message}
          >
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                placeholder="Purchase Requisition Approval"
                {...fieldProps}
                {...form.register("name")}
              />
            )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="wf-category">Category</Label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="wf-category"
                      className="w-full"
                      aria-invalid={Boolean(form.formState.errors.category)}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FormField id="wf-version" label="Version">
              {({ id }) => (
                <Input
                  id={id}
                  value={workflow?.version ?? "v0.1"}
                  readOnly
                  disabled
                />
              )}
            </FormField>
          </div>

          <FormField
            id="wf-description"
            label="Description"
            error={form.formState.errors.description?.message}
            hint="What does this workflow route and why?"
          >
            {({ id, ...fieldProps }) => (
              <Textarea
                id={id}
                rows={2}
                placeholder="Routes a request through review and approval…"
                {...fieldProps}
                {...form.register("description")}
              />
            )}
          </FormField>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Nodes</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    type: "Approval",
                    title: "Approval",
                    description: "",
                    assignee: "",
                  })
                }
              >
                <Plus />
                Add node
              </Button>
            </div>
            {form.formState.errors.nodes?.root ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.nodes.root.message}
              </p>
            ) : null}

            <ol className="grid gap-2">
              {fields.map((field, index) => (
                <li
                  key={field.id}
                  className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_auto]"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name={`nodes.${index}.type`}
                      render={({ field: typeField }) => (
                        <Select
                          value={typeField.value}
                          onValueChange={(value) =>
                            typeField.onChange(
                              (value ?? "Approval") as WorkflowNodeType
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {NODE_TYPES.map((nodeType) => (
                              <SelectItem key={nodeType} value={nodeType}>
                                {nodeType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      placeholder="Node title"
                      aria-label={`Node ${index + 1} title`}
                      {...form.register(`nodes.${index}.title`)}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Move node up"
                      disabled={index === 0}
                      onClick={() => swap(index, index - 1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Move node down"
                      disabled={index === fields.length - 1}
                      onClick={() => swap(index, index + 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove node"
                      className="text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
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
              {isEdit ? "Save workflow" : "Create workflow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
