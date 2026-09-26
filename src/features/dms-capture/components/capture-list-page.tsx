"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  FileText,
  History,
  Loader2,
  ScanLine,
  Sparkles,
  Upload,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useCaptureDocuments } from "../api/capture.queries";
import type { CaptureDocument } from "../types";
import { formatBytes } from "../utils";
import { UploadCaptureDialog } from "./upload-capture-dialog";

const STEP_META: Record<string, string> = {
  Preprocess: "Enhancing image before OCR",
  OCR: "Extracting text",
  Classify: "Classifying document",
  Extract: "Extracting fields",
  Tag: "Auto-tagging",
};

export function CaptureListPage() {
  const { data, isPending, isError, refetch } = useCaptureDocuments();
  const [uploadOpen, setUploadOpen] = React.useState(false);

  const processing = (data ?? []).filter(
    (entry) => entry.status === "Processing" || entry.status === "Uploaded"
  );
  const failed = (data ?? []).filter((entry) => entry.status === "Failed");
  const verified = (data ?? []).filter((entry) => entry.status === "Verified");
  const avgConfidence = (data ?? []).length
    ? Math.round(
        (data ?? []).reduce((sum, entry) => sum + entry.ocrConfidence, 0) /
          (data ?? []).length
      )
    : 0;

  const columns = React.useMemo<ColumnDef<CaptureDocument>[]>(() => {
    return [
      {
        accessorKey: "fileName",
        header: "File",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/dms/capture/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.fileName}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {formatBytes(row.original.size)} · {row.original.pageCount} page
              {row.original.pageCount === 1 ? "" : "s"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "Processing" || status === "Uploaded") {
            return (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Loader2 className="size-3.5 animate-spin" />
                {STEP_META[row.original.step ?? "Preprocess"] ?? status}
              </span>
            );
          }
          return <StatusBadge status={status} />;
        },
      },
      {
        accessorKey: "classification",
        header: "Classification",
        cell: ({ row }) =>
          row.original.classification ? (
            <Badge variant="outline">{row.original.classification}</Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "ocrConfidence",
        header: "OCR Confidence",
        cell: ({ row }) => {
          const confidence = row.original.ocrConfidence;
          const tone =
            confidence >= 85
              ? "text-emerald-600 dark:text-emerald-400"
              : confidence >= 60
                ? "text-amber-600"
                : "text-destructive";
          return (
            <span className={`font-mono text-sm tabular-nums ${tone}`}>
              {confidence > 0 ? `${confidence}%` : "—"}
            </span>
          );
        },
      },
      {
        accessorKey: "uploadedBy",
        header: "Uploaded by",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.uploadedBy}
          </span>
        ),
      },
      {
        accessorKey: "uploadedAt",
        header: "Uploaded",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.uploadedAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link
              href={`/dms/capture/${row.original.id}`}
              className="inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
            >
              <ScanLine className="size-4" />
              Open
            </Link>
          </div>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load capture queue.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="justify-self-start text-sm text-primary underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="In queue" value={processing.length} icon={History} />
        <KpiCard label="Verified" value={verified.length} icon={Sparkles} />
        <KpiCard
          label="Failed"
          value={failed.length}
          icon={FileText}
          trendDirection="down"
        />
        <KpiCard
          label="Avg OCR confidence"
          value={`${avgConfidence}%`}
          icon={ScanLine}
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload />
          Upload scan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="fileName"
        searchPlaceholder="Search captured documents..."
        emptyTitle="No captures"
        emptyDescription="Upload a scanned document to start the AI pipeline."
      />

      {uploadOpen ? (
        <UploadCaptureDialog
          key="upload"
          onOpenChange={(open) => {
            if (!open) setUploadOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
