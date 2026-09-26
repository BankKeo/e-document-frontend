"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfidentialityLevels, useMetaRecords } from "../api/metadata.queries";
import type { MetaRecord } from "../types";
import { MetaRecordDialog } from "./meta-record-dialog";

const CONFIDENTIALITY_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Internal: "secondary",
  Confidential: "destructive",
  Public: "outline",
};

function buildColumns(
  onEdit: (record: MetaRecord) => void
): ColumnDef<MetaRecord>[] {
  return [
    {
      accessorKey: "documentTitle",
      header: "Document",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.documentTitle}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.original.documentNumber}</p>
        </div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.original.documentType}</Badge>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.category}</span>,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.department}</span>,
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.author}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <span className="whitespace-nowrap text-muted-foreground">{row.original.createdAt}</span>,
    },
    {
      accessorKey: "confidentiality",
      header: "Confidentiality",
      cell: ({ row }) => (
        <Badge variant={CONFIDENTIALITY_VARIANTS[row.original.confidentiality] ?? "secondary"}>
          {row.original.confidentiality}
        </Badge>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <span className="flex max-w-60 flex-wrap gap-1">
          {row.original.tags.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            row.original.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))
          )}
        </span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          {!row.original.id.startsWith("doc_8") ? (
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)} aria-label="Edit metadata">
              <Pencil />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];
}

export function MetadataPage() {
  const { data, isPending, isError, refetch } = useMetaRecords();
  const { data: levels } = useConfidentialityLevels();
  const [confidentiality, setConfidentiality] = React.useState<"All" | string>("All");
  const [year, setYear] = React.useState<"All" | string>("All");
  const [editing, setEditing] = React.useState<MetaRecord | null>(null);

  const years = React.useMemo(
    () => Array.from(new Set((data ?? []).map((entry) => entry.createdAt.slice(0, 4)))).sort(),
    [data]
  );

  const rows = React.useMemo(
    () =>
      (data ?? []).filter(
        (entry) =>
          (confidentiality === "All" || entry.confidentiality === confidentiality) &&
          (year === "All" || entry.createdAt.startsWith(year))
      ),
    [data, confidentiality, year]
  );

  const columns = React.useMemo(
    () => buildColumns(setEditing),
    []
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load metadata.</p>
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
    <div className="grid gap-4">
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isPending}
        searchKey="documentTitle"
        searchPlaceholder="Search documents..."
        emptyTitle="No metadata records"
        emptyDescription="Try a different filter."
        toolbar={
          <>
            <Select value={confidentiality} onValueChange={(value) => value && setConfidentiality(value)}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by confidentiality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All levels</SelectItem>
                {levels?.map((level) => (
                  <SelectItem key={level.id} value={level.label}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={(value) => value && setYear(value)}>
              <SelectTrigger size="sm" className="w-32" aria-label="Filter by creation year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All years</SelectItem>
                {years.map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {entry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      {editing ? (
        <MetaRecordDialog
          record={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}