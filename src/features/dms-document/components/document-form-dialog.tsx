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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/features/auth/components/form-field";
import {
  documentFormSchema,
  type DocumentFormInput,
} from "../schemas/document.schemas";
import type { DmsDocument, DocumentClassification } from "../types";
import {
  useCreateDocument,
  useDocumentCategories,
  useUpdateDocument,
} from "../api/document.queries";

export function DocumentFormDialog({
  open,
  onOpenChange,
  document,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: DmsDocument | null;
}) {
  const isEdit = Boolean(document);
  const create = useCreateDocument();
  const update = useUpdateDocument();
  const { data: categories } = useDocumentCategories();

  const form = useForm<DocumentFormInput>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      category: "",
      classification: "Internal",
      description: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      document
        ? {
            title: document.title,
            category: document.category,
            classification: document.classification,
            description: document.versions[0].content,
          }
        : { title: "", category: "", classification: "Internal", description: "" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, document]);

  const submitting = create.isPending || update.isPending;

  async function onSubmit(input: DocumentFormInput) {
    try {
      if (document) {
        await update.mutateAsync({ id: document.id, input });
        toast.success("Document updated");
      } else {
        await create.mutateAsync(input);
        toast.success("Document created");
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
          <DialogTitle>{isEdit ? "Edit document" : "Create document"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Saving creates a new version. The latest version inherits the current file."
              : "A new document starts at version v1.0 and is owned by you."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField id="title" label="Title" error={form.formState.errors.title?.message}>
            {({ id, ...fieldProps }) => (
              <Input id={id} placeholder="Quarterly Performance Report" {...fieldProps} {...form.register("title")} />
            )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="category" className="w-full" aria-invalid={Boolean(form.formState.errors.category)}>
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
              {form.formState.errors.category ? (
                <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="classification" className="text-sm font-medium">
                Classification
              </label>
              <Controller
                control={form.control}
                name="classification"
                render={({ field }) => (
                  <Select
                    value={field.value as DocumentClassification}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="classification" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="Confidential">Confidential</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <FormField
            id="description"
            label={isEdit ? "Content (saves as a new version)" : "Description / content"}
            hint="Optional — this becomes the document content of the first version."
            error={form.formState.errors.description?.message}
          >
            {({ id, ...fieldProps }) => (
              <Textarea
                id={id}
                rows={6}
                placeholder="Describe the document or paste its content…"
                {...fieldProps}
                {...form.register("description")}
              />
            )}
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {isEdit ? "Save version" : "Create document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}