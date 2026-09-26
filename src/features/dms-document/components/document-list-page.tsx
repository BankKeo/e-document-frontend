"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Archive, Download, Eye, FilePlus2, RefreshCcw, Send, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useArchiveDocument,
  useDeleteDocument,
  useDeleteDocumentForever,
  useDocuments,
  useDownloadDocument,
  useRestoreDocument,
} from "../api/document.queries";
import type { DmsDocument } from "../types";
import { downloadText } from "../utils";
import { DocumentFormDialog } from "./document-form-dialog";
import { UploadVersionDialog } from "./upload-version-dialog";
import { ShareDialog } from "./share-dialog";

type ViewFilter = "Active" | "Archived" | "Trash";
type StatusFilter = "All" | "Active" | "Archived";

const CLASS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Internal: "secondary",
  Confidential: "destructive",
  Public: "outline",
};

function DocumentRowActions({
  document,
  onEdit,
  onUpload,
  onShare,
  onDownload,
}: {
  document: DmsDocument;
  onEdit: (document: DmsDocument) => void;
  onUpload: (document: DmsDocument) => void;
  onShare: (document: DmsDocument) => void;
  onDownload: (document: DmsDocument) => void;
}) {
  const archive = useArchiveDocument();
  const restore = useRestoreDocument();
  const deleteDoc = useDeleteDocument();
  const deleteForever = useDeleteDocumentForever();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Document actions" />}>
        <Eye />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem render={<Link href={`/dms/documents/${document.id}`} />}>
          <span className="flex items-center gap-1.5">
            <Eye className="size-4" />
            View
          </span>
        </DropdownMenuItem>
        {!document.trashed ? (
          <>
            <DropdownMenuItem onClick={() => onEdit(document)}>
              <span className="flex items-center gap-1.5">
                <FilePlus2 className="size-4" />
                Edit
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpload(document)}>
              <span className="flex items-center gap-1.5">
                <Upload className="size-4" />
                Upload version
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(document)}>
              <span className="flex items-center gap-1.5">
                <Send className="size-4" />
                Share
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(document)}>
              <span className="flex items-center gap-1.5">
                <Download className="size-4" />
                Download
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {document.status === "Active" ? (
              <DropdownMenuItem onClick={() => void archive.mutateAsync(document.id)}>
                <span className="flex items-center gap-1.5">
                  <Archive className="size-4" />
                  Archive
                </span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => void restore.mutateAsync(document.id)}>
                <span className="flex items-center gap-1.5">
                  <RefreshCcw className="size-4" />
                  Restore
                </span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => void deleteDoc.mutateAsync(document.id)}
            >
              <span className="flex items-center gap-1.5">
                <Trash2 className="size-4" />
                Move to trash
              </span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => void restore.mutateAsync(document.id)}>
              <span className="flex items-center gap-1.5">
                <RefreshCcw className="size-4" />
                Restore
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => void deleteForever.mutateAsync(document.id)}
            >
              <span className="flex items-center gap-1.5">
                <Trash2 className="size-4" />
                Delete forever
              </span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function columnsFor(
  view: ViewFilter,
  handlers: {
    onEdit: (d: DmsDocument) => void;
    onUpload: (d: DmsDocument) => void;
    onShare: (d: DmsDocument) => void;
    onDownload: (d: DmsDocument) => void;
  }
): ColumnDef<DmsDocument>[] {
  return [
    {
      accessorKey: "title",
      header: "Document",
      cell: ({ row }) => (
        <div className="min-w-0">
          <Link
            href={`/dms/documents/${row.original.id}`}
            className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
          >
            {row.original.title}
          </Link>
          <p className="font-mono text-xs text-muted-foreground">
            {row.original.docRef} · {row.original.versions[0].version}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
    },
    {
      accessorKey: "classification",
      header: "Classification",
      cell: ({ row }) => (
        <Badge variant={CLASS_VARIANTS[row.original.classification] ?? "secondary"}>
          {row.original.classification}
        </Badge>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.owner}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    ...(view === "Active"
      ? [
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: DmsDocument } }) => (
              <StatusBadge status={row.original.status} />
            ),
          },
        ]
      : []),
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DocumentRowActions
            document={row.original}
            onEdit={handlers.onEdit}
            onUpload={handlers.onUpload}
            onShare={handlers.onShare}
            onDownload={handlers.onDownload}
          />
        </div>
      ),
    },
  ];
}

export function DocumentListPage() {
  const { data, isPending, isError, refetch } = useDocuments();
  const download = useDownloadDocument();
  const [view, setView] = React.useState<ViewFilter>("Active");
  const [status, setStatus] = React.useState<StatusFilter>("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DmsDocument | null>(null);
  const [uploading, setUploading] = React.useState<DmsDocument | null>(null);
  const [sharing, setSharing] = React.useState<DmsDocument | null>(null);

  const rows = React.useMemo(() => {
    const docs = data ?? [];
    return docs
      .filter((entry) => {
        const inView =
          view === "Trash"
            ? entry.trashed
            : !entry.trashed && entry.status === view;
        const inStatus = status === "All" || entry.status === status;
        return inView && inStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [data, view, status]);

  async function handleDownload(document: DmsDocument) {
    try {
      const result = await download.mutateAsync(document.id);
      downloadText(result.fileName, result.content);
      toast.success(`Downloaded ${result.fileName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download.");
    }
  }

  const handlers = React.useMemo(
    () => ({
      onEdit: (d: DmsDocument) => setEditing(d),
      onUpload: (d: DmsDocument) => setUploading(d),
      onShare: (d: DmsDocument) => setSharing(d),
      onDownload: (d: DmsDocument) => void handleDownload(d),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [download]
  );

  const columns = React.useMemo(
    () => columnsFor(view, handlers),
    [view, handlers]
  );

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load documents.</p>
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
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-[3px]">
          {(["Active", "Archived", "Trash"] as ViewFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              aria-pressed={view === item}
              className={
                view === item
                  ? "h-7 rounded-md bg-background px-2.5 text-sm font-medium shadow-sm"
                  : "h-7 rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {view !== "Trash" ? (
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as StatusFilter)}
            >
              <SelectTrigger size="sm" className="w-32" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
          {view === "Active" ? (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <FilePlus2 />
              New document
            </Button>
          ) : null}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isPending}
        searchKey="title"
        searchPlaceholder="Search documents..."
        emptyTitle={view === "Trash" ? "Trash is empty" : "No documents"}
        emptyDescription={
          view === "Trash"
            ? "Deleted documents will appear here."
            : "Create your first document to get started."
        }
      />

      <DocumentFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editing ? (
        <DocumentFormDialog
          open={Boolean(editing)}
          document={editing}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}
      {uploading ? (
        <UploadVersionDialog
          key={uploading.id}
          document={uploading}
          onOpenChange={(open) => {
            if (!open) setUploading(null);
          }}
        />
      ) : null}
      {sharing ? (
        <ShareDialog
          key={sharing.id}
          document={sharing}
          onOpenChange={(open) => {
            if (!open) setSharing(null);
          }}
        />
      ) : null}
    </div>
  );
}