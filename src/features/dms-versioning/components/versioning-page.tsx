"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  ClipboardPlus,
  Eye,
  FileStack,
  GitCompareArrows,
  History,
  Layers,
  RotateCcw,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVersioningDocuments,
  useVersionRegistry,
} from "../api/versioning.queries";
import type { VersionRegistryRow } from "../types";
import { formatBytes } from "../utils";
import { CreateVersionDialog } from "./create-version-dialog";
import { ViewVersionDialog } from "./view-version-dialog";
import { CompareVersionsDialog } from "./compare-versions-dialog";
import { RestoreVersionDialog } from "./restore-version-dialog";

export function VersioningPage() {
  const { data: registry, isPending, isError, refetch } = useVersionRegistry();
  const { data: documents } = useVersioningDocuments();

  const [documentFilter, setDocumentFilter] = React.useState("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState<VersionRegistryRow | null>(null);
  const [comparing, setComparing] = React.useState<VersionRegistryRow | null>(
    null
  );
  const [restoring, setRestoring] = React.useState<VersionRegistryRow | null>(
    null
  );

  const rows = React.useMemo(() => {
    const source = registry ?? [];
    if (documentFilter === "all") return source;
    return source.filter((row) => row.documentId === documentFilter);
  }, [registry, documentFilter]);

  const filteredDocuments = React.useMemo(() => {
    const seen = new Set<string>();
    return (documents ?? []).filter((document) => {
      if (seen.has(document.id)) return false;
      seen.add(document.id);
      return document.versions.length > 0;
    });
  }, [documents]);

  const versionCount = registry?.length ?? 0;
  const documentCount = filteredDocuments.length;
  const multiVersionDocs = filteredDocuments.filter(
    (d) => d.versions.length > 1
  ).length;
  const restoredCount =
    registry?.filter((row) => row.summary.startsWith("Restored from")).length ??
    0;
  const latestRow = registry?.[0];

  const columns = React.useMemo<ColumnDef<VersionRegistryRow>[]>(() => {
    return [
      {
        accessorKey: "documentTitle",
        header: "Document",
        meta: {
          className: "max-w-[10rem] sm:max-w-[14rem] lg:max-w-56",
        },
        cell: ({ row }) => (
          <div className="min-w-0 whitespace-normal sm:whitespace-nowrap">
            <Link
              href={`/dms/documents/${row.original.documentId}`}
              className="line-clamp-2 text-sm font-medium hover:underline hover:underline-offset-4 sm:truncate"
            >
              {row.original.documentTitle}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.docRef}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "version",
        header: "Version",
        meta: { className: "max-w-32" },
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono text-sm font-medium">
              {row.original.version}
            </span>
            {row.original.isCurrent ? (
              <Badge>Current</Badge>
            ) : (
              <Badge variant="outline">
                {row.original.index + 1} of {row.original.total}
              </Badge>
            )}
          </span>
        ),
      },
      {
        accessorKey: "at",
        header: "Date",
        meta: { className: "hidden max-w-40 sm:table-cell" },
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {new Date(row.original.at).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        accessorKey: "actor",
        header: "Actor",
        meta: { className: "hidden max-w-48 md:table-cell" },
        cell: ({ row }) => (
          <span className="block truncate text-muted-foreground">
            {row.original.actor}
          </span>
        ),
      },
      {
        accessorKey: "summary",
        header: "Note",
        meta: {
          className: "hidden max-w-[9rem] sm:table-cell lg:max-w-48",
        },
        cell: ({ row }) => (
          <span className="block truncate">{row.original.summary}</span>
        ),
      },
      {
        accessorKey: "fileName",
        header: "File",
        meta: {
          className: "hidden max-w-[10rem] md:table-cell lg:max-w-48",
        },
        cell: ({ row }) => (
          <span className="block truncate font-mono text-xs text-muted-foreground">
            {row.original.fileName} · {formatBytes(row.original.size)}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const current = row.original;
          const document = filteredDocuments.find(
            (entry) => entry.id === current.documentId
          );
          const canCompare =
            document !== undefined && document.versions.length > 1;
          return (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="View version"
                onClick={() => setViewing(current)}
              >
                <Eye />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Compare versions"
                disabled={!canCompare}
                onClick={() => setComparing(current)}
              >
                <GitCompareArrows />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Restore version"
                disabled={current.isCurrent}
                onClick={() => setRestoring(current)}
              >
                <RotateCcw />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [filteredDocuments]);

  const comparingDocument = comparing
    ? filteredDocuments.find((document) => document.id === comparing.documentId)
    : undefined;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Documents versioned"
              value={documentCount}
              icon={FileStack}
              trend={
                multiVersionDocs > 0
                  ? `${multiVersionDocs} with multiple versions`
                  : "Version-first"
              }
            />
            <KpiCard
              label="Total versions"
              value={versionCount}
              icon={Layers}
            />
            <KpiCard
              label="Restored versions"
              value={restoredCount}
              icon={RotateCcw}
            />
            <KpiCard
              label="Latest activity"
              value={latestRow ? latestRow.actor : "—"}
              icon={History}
              trend={latestRow ? latestRow.version : undefined}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={documentFilter}
          onValueChange={(value) => setDocumentFilter(value ?? "all")}
        >
          <SelectTrigger
            size="sm"
            className="w-56"
            aria-label="Filter by document"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All documents</SelectItem>
            {filteredDocuments.map((document) => (
              <SelectItem key={document.id} value={document.id}>
                {document.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <ClipboardPlus />
          Create version
        </Button>
      </div>

      {isError ? (
        <div className="grid gap-2 text-sm">
          <p className="text-destructive">Unable to load version history.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="justify-self-start text-sm text-primary underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          isLoading={isPending}
          searchKey="documentTitle"
          searchPlaceholder="Search versions..."
          emptyTitle="No version history"
          emptyDescription={
            documentFilter === "all"
              ? "Create a document and it will be versioned automatically."
              : "This document has no versions yet."
          }
        />
      )}

      {createOpen ? (
        <CreateVersionDialog key="create" onOpenChange={setCreateOpen} />
      ) : null}
      {viewing ? (
        <ViewVersionDialog
          key={viewing.versionId}
          row={viewing}
          onOpenChange={(open) => {
            if (!open) setViewing(null);
          }}
        />
      ) : null}
      {comparing && comparingDocument ? (
        <CompareVersionsDialog
          key={`${comparing.documentId}-${comparing.versionId}`}
          documentId={comparing.documentId}
          documentTitle={comparing.documentTitle}
          versions={comparingDocument.versions}
          initialLeftId={comparingDocument.versions[1]?.id}
          initialRightId={comparing.versionId}
          onOpenChange={(open) => {
            if (!open) setComparing(null);
          }}
        />
      ) : null}
      {restoring ? (
        <RestoreVersionDialog
          key={restoring.versionId}
          row={restoring}
          onOpenChange={(open) => {
            if (!open) setRestoring(null);
          }}
        />
      ) : null}
    </div>
  );
}
