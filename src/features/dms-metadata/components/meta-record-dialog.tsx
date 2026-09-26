"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  metaFieldsSchema,
  type MetaFieldsInput,
} from "../schemas/metadata.schemas";
import type { MetaRecord } from "../types";
import {
  useAuthors,
  useCategoriesQuery,
  useConfidentialityLevels,
  useDocumentTypes,
  useMetadataDepartments,
  useTags,
  useUpdateMetaRecord,
} from "../api/metadata.queries";

export function MetaRecordDialog({
  record,
  onOpenChange,
}: {
  record: MetaRecord;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useUpdateMetaRecord();
  const { data: types } = useDocumentTypes();
  const { data: categories } = useCategoriesQuery();
  const { data: departments } = useMetadataDepartments();
  const { data: authors } = useAuthors();
  const { data: levels } = useConfidentialityLevels();
  const { data: tags } = useTags();

  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    () => new Set(record.tags)
  );

  const form = useForm<MetaFieldsInput>({
    resolver: zodResolver(metaFieldsSchema),
    defaultValues: {
      documentType: record.documentType,
      category: record.category,
      department: record.department,
      author: record.author,
      confidentiality: record.confidentiality,
    },
  });

  function toggleTag(name: string) {
    setSelectedTags((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function onSubmit(input: MetaFieldsInput) {
    try {
      await update.mutateAsync({
        id: record.id,
        input: { ...input, tags: [...selectedTags] },
      });
      toast.success("Metadata saved");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit document metadata</DialogTitle>
          <DialogDescription>
            {record.documentNumber} · {record.documentTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Document type" name="documentType" form={form} options={(types ?? []).map((t) => t.name)} />
            <SelectField label="Category" name="category" form={form} options={(categories ?? []).map((c) => c.name)} />
            <SelectField label="Department" name="department" form={form} options={departments ?? []} />
            <SelectField label="Author" name="author" form={form} options={(authors ?? []).map((a) => a.name)} />
            <SelectField label="Confidentiality" name="confidentiality" form={form} options={(levels ?? []).map((l) => l.label)} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 rounded-lg border p-2.5">
              {(tags ?? []).map((tag) => {
                const selected = selectedTags.has(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-input"
                    )}
                  >
                    #{tag.name}
                  </button>
                );
              })}
              {!tags?.length ? <span className="text-xs text-muted-foreground">No tags available.</span> : null}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={update.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending && <Loader2 className="animate-spin" />}
              Save metadata
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SelectField({
  label,
  name,
  form,
  options,
}: {
  label: string;
  name: keyof MetaFieldsInput;
  form: UseFormReturn<MetaFieldsInput>;
  options: string[];
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select value={field.value || undefined} onValueChange={field.onChange}>
            <SelectTrigger id={name} className="w-full" aria-invalid={Boolean(form.formState.errors[name])}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {form.formState.errors[name] ? (
        <p className="text-sm text-destructive">{form.formState.errors[name].message}</p>
      ) : null}
    </div>
  );
}