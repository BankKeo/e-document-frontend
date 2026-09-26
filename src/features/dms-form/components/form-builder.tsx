"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowLeft,
  CheckSquare,
  ChevronDown,
  Eye,
  Hash,
  Loader2,
  Plus,
  Save,
  Send,
  Signature,
  TextCursorInput,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useForm as useFormQuery,
  usePublishForm,
  useSubmitForm,
  useUpdateFormFields,
} from "../api/form.queries";
import type { EFormField, FormFieldType } from "../types";

const builderSchema = z.object({
  fields: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          "Text",
          "Number",
          "Date",
          "Dropdown",
          "Checkbox",
          "File Upload",
          "Signature",
        ]),
        label: z.string().trim().min(1, "Label is required."),
        placeholder: z.string().optional(),
        required: z.boolean(),
        options: z.array(z.string()).optional(),
        condition: z.string().optional(),
      })
    )
    .min(1, "Add at least one field."),
});

type BuilderInput = z.infer<typeof builderSchema>;

const FIELD_OPTIONS: {
  type: FormFieldType;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { type: "Text", icon: TextCursorInput },
  { type: "Number", icon: Hash },
  { type: "Date", icon: CalendarGlyph },
  { type: "Dropdown", icon: ChevronDown },
  { type: "Checkbox", icon: CheckSquare },
  { type: "File Upload", icon: Upload },
  { type: "Signature", icon: Signature },
];

function CalendarGlyph(props: { className?: string }) {
  return <span className={props.className}>◷</span>;
}

const TYPE_BADGE: Record<
  FormFieldType,
  "outline" | "secondary" | "default" | "destructive"
> = {
  Text: "secondary",
  Number: "outline",
  Date: "outline",
  Dropdown: "secondary",
  Checkbox: "outline",
  "File Upload": "secondary",
  Signature: "destructive",
};

export function FormBuilder({ id }: { id: string }) {
  const { data: form, isPending, isError, refetch } = useFormQuery(id);
  const save = useUpdateFormFields();
  const publish = usePublishForm();
  const submit = useSubmitForm();
  const [preview, setPreview] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const fieldSeq = React.useRef(0);

  const defaultValues = React.useMemo(
    () => ({
      fields:
        form?.fields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder ?? "",
          required: field.required,
          options: field.options ?? [],
          condition: field.condition ?? "",
        })) ?? [],
    }),
    [form]
  );

  const formApi = useForm<BuilderInput>({
    resolver: zodResolver(builderSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: formApi.control,
    name: "fields",
  });

  const visibleFields = useWatch({
    control: formApi.control,
    name: "fields",
  }) as BuilderInput["fields"];
  const fieldCount = visibleFields.length;

  // Hydrate the builder when the form loads / id changes.
  const lastId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!form) return;
    if (lastId.current === form.id && formApi.formState.isDirty) return;
    lastId.current = form.id;
    formApi.reset(defaultValues);
    const next: Record<string, string> = {};
    form.fields.forEach((field) => {
      if (field.type === "Checkbox") next[field.id] = "false";
    });
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, form]);

  function addField(type: FormFieldType) {
    fieldSeq.current += 1;
    append({
      id: `temp_${fieldSeq.current}`,
      type,
      label: type,
      placeholder: "",
      required: false,
      options: type === "Dropdown" ? ["Option A", "Option B"] : [],
      condition: "",
    });
  }

  async function handleSave(input: BuilderInput) {
    try {
      const fieldsToSave: EFormField[] = input.fields.map((field) => ({
        id: field.id,
        type: field.type,
        label: field.label.trim(),
        placeholder: field.placeholder,
        required: field.required,
        options:
          field.options && field.options.length > 0 ? field.options : undefined,
        condition: field.condition || undefined,
      }));
      await save.mutateAsync({ id, fields: fieldsToSave });
      toast.success("Form builder saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  async function handleSubmit() {
    try {
      const payload: Record<string, string> = {};
      fields.forEach((field) => {
        payload[field.label] =
          values[field.id]?.trim() || (field.required ? "—" : "");
      });
      await submit.mutateAsync({ id, values: payload });
      toast.success("Test submission recorded");
      setPreview(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit.");
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading form…
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load form</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/dms/forms"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to forms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/dms/forms"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to forms
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {form.name}
              </h2>
              <StatusBadge status={form.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {form.category} · {form.version} · {fieldCount} fields
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {form.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview((prev) => !prev)}
            >
              <Eye />
              {preview ? "Builder" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void publish.mutateAsync(form.id)}
              disabled={publish.isPending}
            >
              {publish.isPending && <Loader2 className="animate-spin" />}
              {form.status === "Published" ? "Archive" : "Publish"}
            </Button>
            <Button
              size="sm"
              onClick={formApi.handleSubmit(handleSave)}
              disabled={save.isPending}
            >
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
              Save builder
            </Button>
          </div>
        </CardContent>
      </Card>

      {preview ? (
        <Card>
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
            <CardDescription>
              Fill in and submit to record a test submission (FORM-012).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {visibleFields.map((field) => {
              const typed = field as unknown as {
                id: string;
                type: FormFieldType;
                label: string;
                required: boolean;
                placeholder?: string;
                options?: string[];
              };
              return (
                <div key={typed.id} className="grid gap-2">
                  <label
                    htmlFor={`preview-${typed.id}`}
                    className="text-sm font-medium"
                  >
                    {typed.label}
                    {typed.required ? (
                      <span className="text-destructive"> *</span>
                    ) : null}
                  </label>
                  <PreviewField
                    field={typed}
                    value={values[typed.id] ?? ""}
                    onChange={(value) =>
                      setValues((prev) => ({ ...prev, [typed.id]: value }))
                    }
                  />
                </div>
              );
            })}
            {visibleFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No fields to preview yet.
              </p>
            ) : (
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={submit.isPending}>
                  {submit.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                  Submit form
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Field palette</CardTitle>
              <CardDescription>
                Click to add a field to your form (FORM-003…010).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {FIELD_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => addField(option.type)}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <option.icon className="size-4 shrink-0 text-muted-foreground" />
                  <Plus className="ml-auto size-3.5 text-muted-foreground" />
                  {option.type}
                </button>
              ))}
            </CardContent>
          </Card>

          <form
            onSubmit={formApi.handleSubmit((input) => void handleSave(input))}
            noValidate
          >
            <Card>
              <CardHeader>
                <CardTitle>Fields</CardTitle>
                <CardDescription>
                  Edit each field&apos;s label, placeholder, required status,
                  and options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Add fields from the palette to design this form.
                  </p>
                ) : (
                  <ol className="grid gap-3">
                    {fields.map((field, index) => (
                      <li
                        key={field.id}
                        className="grid gap-3 rounded-lg border p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-medium">
                              {index + 1}
                            </span>
                            <Badge variant={TYPE_BADGE[field.type]}>
                              {field.type}
                            </Badge>
                          </div>
                          <Controller
                            control={formApi.control}
                            name={`fields.${index}.required`}
                            render={({ field: requiredField }) => (
                              <label className="flex items-center gap-1.5 text-sm">
                                <input
                                  type="checkbox"
                                  checked={requiredField.value as boolean}
                                  onChange={(event) =>
                                    requiredField.onChange(event.target.checked)
                                  }
                                  className="accent-primary"
                                />
                                Required
                              </label>
                            )}
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="grid gap-1.5">
                            <label
                              htmlFor={`label-${field.id}`}
                              className="text-xs font-medium text-muted-foreground"
                            >
                              Label
                            </label>
                            <Controller
                              control={formApi.control}
                              name={`fields.${index}.label`}
                              render={({ field: labelField }) => (
                                <Input
                                  id={`label-${field.id}`}
                                  value={labelField.value as string}
                                  onChange={(event) =>
                                    labelField.onChange(event.target.value)
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label
                              htmlFor={`placeholder-${field.id}`}
                              className="text-xs font-medium text-muted-foreground"
                            >
                              Placeholder
                            </label>
                            <Controller
                              control={formApi.control}
                              name={`fields.${index}.placeholder`}
                              render={({ field: placeholderField }) => (
                                <Input
                                  id={`placeholder-${field.id}`}
                                  value={
                                    (placeholderField.value as string) ?? ""
                                  }
                                  onChange={(event) =>
                                    placeholderField.onChange(
                                      event.target.value
                                    )
                                  }
                                />
                              )}
                            />
                          </div>
                        </div>
                        {field.type === "Dropdown" ? (
                          <div className="grid gap-1.5">
                            <label
                              htmlFor={`options-${field.id}`}
                              className="text-xs font-medium text-muted-foreground"
                            >
                              Dropdown options (comma separated)
                            </label>
                            <Controller
                              control={formApi.control}
                              name={`fields.${index}.options`}
                              render={({ field: optionsField }) => (
                                <Input
                                  id={`options-${field.id}`}
                                  value={
                                    (optionsField.value as string[])?.join(
                                      ", "
                                    ) ?? ""
                                  }
                                  onChange={(event) =>
                                    optionsField.onChange(
                                      event.target.value
                                        .split(",")
                                        .map((opt) => opt.trim())
                                        .filter(Boolean)
                                    )
                                  }
                                />
                              )}
                            />
                          </div>
                        ) : null}
                        <div className="grid gap-1.5">
                          <label
                            htmlFor={`condition-${field.id}`}
                            className="text-xs font-medium text-muted-foreground"
                          >
                            Condition (FORM-010)
                          </label>
                          <Controller
                            control={formApi.control}
                            name={`fields.${index}.condition`}
                            render={({ field: conditionField }) => (
                              <Input
                                id={`condition-${field.id}`}
                                value={(conditionField.value as string) ?? ""}
                                placeholder="e.g. show if Department = Procurement"
                                onChange={(event) =>
                                  conditionField.onChange(event.target.value)
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 />
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </form>
        </div>
      )}

      {form.submissions && form.submissions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              Recorded submissions · {form.submissions.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {form.submissions.slice(0, 5).map((submission) => (
                <li
                  key={submission.id}
                  className="flex items-start gap-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{submission.actor}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.at).toLocaleString()} ·{" "}
                      {Object.entries(submission.values)
                        .slice(0, 3)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function PreviewField({
  field,
  value,
  onChange,
}: {
  field: {
    id: string;
    type: FormFieldType;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
  };
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `preview-${field.id}`;
  if (field.type === "Checkbox") {
    return (
      <label htmlFor={id} className="flex items-center gap-2 text-sm">
        <input
          id={id}
          type="checkbox"
          className="accent-primary"
          checked={value === "true"}
          onChange={(event) => onChange(String(event.target.checked))}
        />
        Yes
      </label>
    );
  }
  if (field.type === "Number") {
    return (
      <Input
        id={id}
        type="number"
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  if (field.type === "Date") {
    return (
      <Input
        id={id}
        type="date"
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  if (field.type === "Dropdown") {
    return (
      <div className="relative">
        <select
          id={id}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  }
  if (field.type === "File Upload") {
    return (
      <Input
        id={id}
        type="file"
        placeholder={field.placeholder}
        className="cursor-pointer file:cursor-pointer"
      />
    );
  }
  if (field.type === "Signature") {
    return (
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
        <Signature className="size-4" />
        Signature pad placeholder
      </div>
    );
  }
  return (
    <Input
      id={id}
      placeholder={field.placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
