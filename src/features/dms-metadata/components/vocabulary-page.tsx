"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/features/auth/components/form-field";
import { EntityRowActions } from "@/components/shared/entity-row-actions";
import {
  authorSchema,
  type AuthorInput,
  type CategoryInput,
  type DocumentTypeInput,
} from "../schemas/metadata.schemas";
import {
  useAddTag,
  useAuthors,
  useCategoriesQuery,
  useConfidentialityLevels,
  useCreateAuthor,
  useCreateCategory,
  useCreateDocumentType,
  useDeleteAuthor,
  useDeleteCategory,
  useDeleteDocumentType,
  useDeleteTag,
  useDocumentTypes,
  useMetaRecords,
  useMetadataDepartments,
  useNumberingScheme,
  useSaveNumberingScheme,
  useTags,
} from "../api/metadata.queries";
import type { NumberingScheme } from "../types";

function NameEntryDialog({
  title,
  description,
  placeholder,
  onOpenChange,
  onSubmit,
}: {
  title: string;
  description: string;
  placeholder: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, description: string) => void | Promise<unknown>;
}) {
  const [name, setName] = React.useState("");
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      toast.error("A name is required.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit(name.trim(), note.trim());
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField id="name-entry" label="Name" error={undefined}>
            {({ id }) => (
              <Input
                id={id}
                placeholder={placeholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSubmit();
                  }
                }}
              />
            )}
          </FormField>
          <FormField id="note-entry" label="Description" hint="Optional" error={undefined}>
            {({ id }) => (
              <Input
                id={id}
                placeholder="Short description"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            )}
          </FormField>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={busy}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AuthorEntryDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const create = useCreateAuthor();
  const { data: departments } = useMetadataDepartments();
  const form = useForm<AuthorInput>({
    resolver: zodResolver(authorSchema),
    defaultValues: { name: "", email: "", department: "" },
  });

  async function onSubmit(input: AuthorInput) {
    try {
      await create.mutateAsync(input);
      toast.success(`${input.name} added`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add author</DialogTitle>
          <DialogDescription>
            Authors appear in the document metadata dropdown.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField id="a-name" label="Name" error={form.formState.errors.name?.message}>
            {({ id, ...props }) => (
              <Input id={id} placeholder="Jane Doe" {...props} {...form.register("name")} />
            )}
          </FormField>
          <FormField id="a-email" label="Email" error={form.formState.errors.email?.message}>
            {({ id, ...props }) => (
              <Input id={id} type="email" placeholder="jane@acme.gov" {...props} {...form.register("email")} />
            )}
          </FormField>
          <div className="grid gap-2">
            <label htmlFor="a-department" className="text-sm font-medium">
              Department
            </label>
            <Controller
              control={form.control}
              name="department"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger id="a-department" className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={create.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              Add author
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NumberingCard() {
  const { data: scheme } = useNumberingScheme();
  const save = useSaveNumberingScheme();
  const [edited, setEdited] = React.useState<{
    prefix: string;
    includeYear: boolean;
    counter: number;
  } | null>(null);

  const source = scheme ?? { prefix: "DOC", includeYear: true, counter: 1 };
  const current = edited ?? source;

  const year = new Date().getFullYear();
  const preview = `${current.prefix || "DOC"}${current.includeYear ? `-${year}` : ""}-${String(current.counter).padStart(4, "0")}`;

  async function handleSave() {
    const next: NumberingScheme = {
      prefix: current.prefix.trim() || "DOC",
      includeYear: current.includeYear,
      counter: current.counter,
    };
    try {
      await save.mutateAsync(next);
      setEdited(null);
      toast.success("Numbering scheme saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document numbering</CardTitle>
        <CardDescription>
          Controls how document numbers are generated (DMS-META-001).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="n-prefix" label="Prefix" error={undefined}>
            {({ id }) => (
              <Input
                id={id}
                placeholder="DOC"
                value={current.prefix}
                onChange={(event) =>
                  setEdited({ ...current, prefix: event.target.value })
                }
              />
            )}
          </FormField>
          <FormField id="n-counter" label="Next number" error={undefined}>
            {({ id }) => (
              <Input
                id={id}
                type="number"
                min={1}
                value={current.counter}
                onChange={(event) =>
                  setEdited({ ...current, counter: Number(event.target.value) || 1 })
                }
              />
            )}
          </FormField>
          <div className="grid items-end gap-2">
            <Label htmlFor="n-year" className="justify-self-start gap-2 text-muted-foreground">
              <Checkbox
                id="n-year"
                checked={current.includeYear}
                onCheckedChange={(checked) =>
                  setEdited({ ...current, includeYear: Boolean(checked) })
                }
              />
              Include year
            </Label>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
          <p className="text-sm text-muted-foreground">
            Next number:{" "}
            <code className="ml-1 rounded bg-background px-2 py-0.5 font-mono text-sm">{preview}</code>
          </p>
          <Button size="sm" onClick={handleSave} disabled={edited === null || save.isPending}>
            Save scheme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function VocabularyPage() {
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [authorOpen, setAuthorOpen] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");

  const { data: metaRecords } = useMetaRecords();
  const { data: departments } = useMetadataDepartments();
  const { data: levels } = useConfidentialityLevels();
  const typesQuery = useDocumentTypes();
  const categoriesQuery = useCategoriesQuery();
  const authorsQuery = useAuthors();
  const tagsQuery = useTags();

  const createType = useCreateDocumentType();
  const createCategory = useCreateCategory();
  const addTag = useAddTag();
  const deleteType = useDeleteDocumentType();
  const deleteCategory = useDeleteCategory();
  const deleteAuthor = useDeleteAuthor();
  const deleteTag = useDeleteTag();

  const typeColumns = React.useMemo<ColumnDef<{ id: string; name: string; description: string }>[]>(
    () => [
      { accessorKey: "name", header: "Type", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: "description", header: "Description", cell: ({ row }) => <span className="line-clamp-1 text-muted-foreground">{row.original.description || "—"}</span> },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <EntityRowActions
              title="Delete type?"
              description={`Removing "${row.original.name}" from the vocabulary.`}
              onDelete={() => deleteType.mutateAsync(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [deleteType]
  );

  const categoryColumns = React.useMemo<ColumnDef<{ id: string; name: string; description: string }>[]>(
    () => [
      { accessorKey: "name", header: "Category", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: "description", header: "Description", cell: ({ row }) => <span className="line-clamp-1 text-muted-foreground">{row.original.description || "—"}</span> },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <EntityRowActions
              title="Delete category?"
              description={`Removing "${row.original.name}" from the vocabulary.`}
              onDelete={() => deleteCategory.mutateAsync(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [deleteCategory]
  );

  const authorColumns = React.useMemo<ColumnDef<{ id: string; name: string; email: string; department: string }>[]>(
    () => [
      { accessorKey: "name", header: "Author", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: "email", header: "Email", cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span> },
      { accessorKey: "department", header: "Department", cell: ({ row }) => <Badge variant="outline">{row.original.department}</Badge> },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <EntityRowActions
              title="Remove author?"
              description={`Removing "${row.original.name}" from the author list.`}
              onDelete={() => deleteAuthor.mutateAsync(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [deleteAuthor]
  );

  const tagColumns = React.useMemo<ColumnDef<{ id: string; name: string; count: number }>[]>(
    () => [
      { accessorKey: "name", header: "Tag", cell: ({ row }) => <code className="text-sm">#{row.original.name}</code> },
      { accessorKey: "count", header: "In use", cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.count}</span> },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            {row.original.count === 0 ? (
              <EntityRowActions
                title="Delete tag?"
                description={`Removing tag #${row.original.name}.`}
                onDelete={() => deleteTag.mutateAsync(row.original.id)}
              />
            ) : (
              <span className="px-2 text-xs text-muted-foreground">In use</span>
            )}
          </div>
        ),
      },
    ],
    [deleteTag]
  );

  const departmentCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const record of metaRecords ?? []) {
      map.set(record.department, (map.get(record.department) ?? 0) + 1);
    }
    return map;
  }, [metaRecords]);

  function handleAddTag(event: React.FormEvent) {
    event.preventDefault();
    const name = tagInput.trim();
    if (!name) return;
    addTag.mutate(name, {
      onSuccess: () => {
        setTagInput("");
        toast.success(`Tag #${name.toLowerCase()} added`);
      },
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : "Unable to add tag."),
    });
  }

  return (
    <div className="grid gap-6">
      <NumberingCard />

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="grid gap-0.5">
            <h3 className="text-sm font-medium">Document types</h3>
            <p className="text-xs text-muted-foreground">DMS-META-002</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setTypeOpen(true)}>
            <Plus />
            Add type
          </Button>
        </div>
        <DataTable
          columns={typeColumns}
          data={(typesQuery.data ?? []).map((entry) => ({ id: entry.id, name: entry.name, description: entry.description }))}
          isLoading={typesQuery.isPending}
          searchKey="name"
          searchPlaceholder="Search types..."
          emptyTitle="No document types"
        />
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="grid gap-0.5">
            <h3 className="text-sm font-medium">Categories</h3>
            <p className="text-xs text-muted-foreground">DMS-META-003</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setCategoryOpen(true)}>
            <Plus />
            Add category
          </Button>
        </div>
        <DataTable
          columns={categoryColumns}
          data={(categoriesQuery.data ?? []).map((entry) => ({ id: entry.id, name: entry.name, description: entry.description }))}
          isLoading={categoriesQuery.isPending}
          searchKey="name"
          searchPlaceholder="Search categories..."
          emptyTitle="No categories"
        />
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="grid gap-0.5">
            <h3 className="text-sm font-medium">Authors</h3>
            <p className="text-xs text-muted-foreground">DMS-META-005</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setAuthorOpen(true)}>
            <Plus />
            Add author
          </Button>
        </div>
        <DataTable
          columns={authorColumns}
          data={(authorsQuery.data ?? []).map((entry) => ({ id: entry.id, name: entry.name, email: entry.email, department: entry.department }))}
          isLoading={authorsQuery.isPending}
          searchKey="name"
          searchPlaceholder="Search authors..."
          emptyTitle="No authors"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>DMS-META-004 — managed in the Organization module.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {departments?.map((department) => (
                <li key={department} className="flex items-center justify-between py-2">
                  <span className="text-sm">{department}</span>
                  <Badge variant="secondary">{departmentCounts.get(department) ?? 0} docs</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confidentiality levels</CardTitle>
            <CardDescription>DMS-META-007 — defined by policy.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {levels?.map((level) => (
                <li key={level.id} className="flex items-start justify-between gap-4 py-2">
                  <div className="min-w-0">
                    <Badge variant="secondary">{level.label}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="grid gap-0.5">
            <h3 className="text-sm font-medium">Tags</h3>
            <p className="text-xs text-muted-foreground">DMS-META-008</p>
          </div>
          <form className="flex gap-2" onSubmit={handleAddTag}>
            <Input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              placeholder="Add a tag…"
              className="h-7 w-40 text-sm"
            />
            <Button type="submit" size="sm" variant="outline">
              <Plus />
              Add
            </Button>
          </form>
        </div>
        <DataTable
          columns={tagColumns}
          data={(tagsQuery.data ?? []).map((entry) => ({ id: entry.id, name: entry.name, count: entry.count }))}
          isLoading={tagsQuery.isPending}
          searchKey="name"
          searchPlaceholder="Search tags..."
          emptyTitle="No tags"
        />
      </section>

      {typeOpen ? (
        <NameEntryDialog
          title="Add document type"
          description="A new type appears in the metadata dropdown."
          placeholder="e.g. Guideline"
          onOpenChange={setTypeOpen}
          onSubmit={(name, description) =>
            createType.mutateAsync({ name, description } satisfies DocumentTypeInput)
          }
        />
      ) : null}
      {categoryOpen ? (
        <NameEntryDialog
          title="Add category"
          description="A new category appears in the metadata dropdown."
          placeholder="e.g. Regulatory"
          onOpenChange={setCategoryOpen}
          onSubmit={(name, description) =>
            createCategory.mutateAsync({ name, description } satisfies CategoryInput)
          }
        />
      ) : null}
      {authorOpen ? <AuthorEntryDialog onOpenChange={setAuthorOpen} /> : null}
    </div>
  );
}