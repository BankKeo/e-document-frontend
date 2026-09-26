"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Search,
  Sparkles,
  Tag,
  Wand2,
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
import { cn } from "@/lib/utils";
import {
  useCaptureDocument,
  useClassifyDocument,
  useRunOcr,
  useSaveCaptureFields,
} from "../api/capture.queries";
import type { ExtractedField } from "../types";

const STEP_ORDER: string[] = [
  "Preprocess",
  "OCR",
  "Classify",
  "Extract",
  "Tag",
];
const STATUS_STEP: Record<string, string> = {
  Uploaded: "Preprocess",
  Processing: "OCR",
  Classified: "Classify",
  Extracted: "Extract",
  Verified: "Tag",
  Failed: "Preprocess",
};

export function CaptureDetail({ id }: { id: string }) {
  const {
    data: document,
    isPending,
    isError,
    refetch,
  } = useCaptureDocument(id);
  const runOcr = useRunOcr();
  const classify = useClassifyDocument();
  const saveFields = useSaveCaptureFields();
  const [fieldEdits, setFieldEdits] = React.useState<Record<string, string>>(
    {}
  );
  const [tagInput, setTagInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [classificationEdit, setClassificationEdit] = React.useState("");

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading capture…
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load capture</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/dms/capture"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to capture queue
          </Link>
        </div>
      </div>
    );
  }

  const currentDocument = document;
  const currentStep = STATUS_STEP[currentDocument.status] ?? "Preprocess";
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const highlighted =
    currentDocument.text?.toLowerCase().includes(search.toLowerCase()) ?? false;

  const effectiveClassification =
    classificationEdit || currentDocument.classification || "";

  const resolveFields = (): ExtractedField[] =>
    (currentDocument.fields ?? []).map((field) =>
      fieldEdits[field.key] !== undefined
        ? {
            ...field,
            value: fieldEdits[field.key],
            source: "Manual" as const,
            confidence: 1,
          }
        : field
    );

  async function handleRunOcr() {
    try {
      await runOcr.mutateAsync(currentDocument.id);
      toast.success("OCR completed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to run OCR."
      );
    }
  }

  async function handleClassify() {
    try {
      const next = await classify.mutateAsync({
        id: currentDocument.id,
        classification: effectiveClassification,
      });
      toast.success("Document classified");
      setClassificationEdit(next.classification ?? "");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to classify."
      );
    }
  }

  async function handleSave() {
    try {
      await saveFields.mutateAsync({
        id: currentDocument.id,
        fields: resolveFields(),
      });
      toast.success("Extraction saved");
      setFieldEdits({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  const fieldsForRender = resolveFields();
  const dirty = Object.keys(fieldEdits).length > 0;

  return (
    <div className="grid gap-6">
      <Link
        href="/dms/capture"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to capture queue
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {document.fileName}
              </h2>
              <StatusBadge status={document.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {document.classification ?? "Unclassified"} · uploaded by{" "}
              {document.uploadedBy}
            </p>
            {document.error ? (
              <p className="mt-1 text-sm text-destructive">{document.error}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {document.status === "Uploaded" || document.status === "Failed" ? (
              <Button
                size="sm"
                onClick={handleRunOcr}
                disabled={runOcr.isPending}
              >
                {runOcr.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 />
                )}
                Run OCR
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline stepper (AI-002 … AI-012) */}
      <Card>
        <CardHeader>
          <CardTitle>AI pipeline</CardTitle>
          <CardDescription>
            Preprocessing → OCR → Classification → Extraction → Tagging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {document.status === "Failed" ? (
            <p className="text-sm text-destructive">
              Pipeline failed. {document.error}
            </p>
          ) : (
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {STEP_ORDER.map((step, index) => {
                const reached = index <= stepIndex;
                const done =
                  index < stepIndex || document.status === "Verified";
                return (
                  <li
                    key={step}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      done && "border-emerald-500/40 bg-emerald-500/5",
                      reached && !done && "border-primary/40 bg-primary/5"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                        {index + 1}
                      </span>
                    )}
                    <span className="truncate font-medium">{step}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* OCR text + search (AI-004, AI-014) */}
        <Card>
          <CardHeader>
            <CardTitle>Extracted text</CardTitle>
            <CardDescription>OCR output is searchable inline.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search extracted text…"
                className="pl-8"
                aria-label="Search extracted text"
              />
            </div>
            {search ? (
              <p className="text-xs text-muted-foreground">
                {highlighted
                  ? "Text matches your search."
                  : "No matching lines."}
              </p>
            ) : null}
            <pre className="max-h-80 overflow-y-auto rounded-lg bg-muted/50 p-4 font-sans text-sm whitespace-pre-wrap text-foreground/90">
              {document.text ??
                "OCR not run yet. Click “Run OCR” to extract text."}
            </pre>
          </CardContent>
        </Card>

        {/* Classification + fields (AI-005…AI-011, AI-013) */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Classification & tags</CardTitle>
              <CardDescription>
                AI-009 classification, AI-010 auto-tagging.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                <Input
                  value={effectiveClassification}
                  onChange={(event) =>
                    setClassificationEdit(event.target.value)
                  }
                  placeholder="Classification (e.g. Invoice)"
                  className="max-w-xs"
                  aria-label="Classification"
                />
                <Button
                  variant="outline"
                  onClick={handleClassify}
                  disabled={classify.isPending}
                >
                  {classify.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                  Classify
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="size-4 text-muted-foreground" />
                {(document.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                <Input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder="Add tag"
                  className="h-7 w-36"
                  aria-label="Add tag"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted fields</CardTitle>
              <CardDescription>
                AI-extracted metadata with confidence scores. Edit any field to
                mark it manual (AI-013).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {fieldsForRender.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No fields extracted yet. Run OCR and classification first.
                </p>
              ) : (
                fieldsForRender.map((field) => (
                  <div
                    key={field.key}
                    className="grid gap-1.5 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {field.label}
                        {field.source === "Manual" ? (
                          <Badge variant="outline" className="ml-2">
                            Manual
                          </Badge>
                        ) : null}
                      </p>
                      <Badge
                        variant="secondary"
                        className="font-mono tabular-nums"
                      >
                        {(field.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Input
                      value={field.value}
                      aria-label={field.label}
                      onChange={(event) =>
                        setFieldEdits((prev) => ({
                          ...prev,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                  </div>
                ))
              )}
              <Button
                onClick={handleSave}
                disabled={saveFields.isPending || fieldsForRender.length === 0}
              >
                {saveFields.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 />
                )}
                {dirty ? "Save changes" : "Save extraction"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
