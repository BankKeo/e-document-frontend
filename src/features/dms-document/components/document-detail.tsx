"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArrowLeft,
  Download,
  FilePlus2,
  Loader2,
  RefreshCcw,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useArchiveDocument,
  useDeleteDocument,
  useDeleteDocumentForever,
  useDocument,
  useDownloadDocument,
  useRestoreDocument,
} from "../api/document.queries";
import type { DmsDocument, DocumentVersion } from "../types";
import { downloadText, formatBytes } from "../utils";
import { DocumentFormDialog } from "./document-form-dialog";
import { UploadVersionDialog } from "./upload-version-dialog";
import { ShareDialog } from "./share-dialog";

const CLASS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Internal: "secondary",
  Confidential: "destructive",
  Public: "outline",
};

const versionColumns: ColumnDef<DocumentVersion>[] = [
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">{row.original.version}</span>
    ),
  },
  {
    accessorKey: "at",
    header: "Date",
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
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.actor}</span>,
  },
  {
    accessorKey: "summary",
    header: "Note",
    cell: ({ row }) => <span className="line-clamp-1">{row.original.summary}</span>,
  },
  {
    accessorKey: "fileName",
    header: "File",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.fileName} · {formatBytes(row.original.size)}
      </span>
    ),
  },
];

export function DocumentDetail({ id }: { id: string }) {
  const { data: document, isPending, isError, refetch } = useDocument(id);
  const download = useDownloadDocument();
  const archive = useArchiveDocument();
  const restore = useRestoreDocument();
  const deleteDoc = useDeleteDocument();
  const deleteForever = useDeleteDocumentForever();
  const [editOpen, setEditOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);

  async function handleDownload(doc: DmsDocument) {
    try {
      const result = await download.mutateAsync(doc.id);
      downloadText(result.fileName, result.content);
      toast.success(`Downloaded ${result.fileName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download.");
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading document…
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load document</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link href="/dms/documents" className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted">
            <ArrowLeft className="size-4" />
            Back to documents
          </Link>
        </div>
      </div>
    );
  }

  const latest = document.versions[0];

  return (
    <div className="grid gap-6">
      <Link
        href="/dms/documents"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to documents
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {document.title}
              </h2>
              <StatusBadge status={document.trashed ? "Deleted" : document.status} />
              {document.trashed ? <Badge variant="outline">Trash</Badge> : null}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {document.docRef} · {latest.version}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{document.category}</Badge>
              <Badge variant={CLASS_VARIANTS[document.classification] ?? "secondary"}>
                {document.classification}
              </Badge>
              <Badge variant="secondary">{document.department}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!document.trashed ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                  <Send />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <FilePlus2 />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
                  <Upload />
                  Upload
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDownload(document)}>
                  <Download />
                  Download
                </Button>
                {document.status === "Active" ? (
                  <Button variant="secondary" size="sm" onClick={() => void archive.mutateAsync(document.id)}>
                    <Archive />
                    Archive
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => void restore.mutateAsync(document.id)}>
                    <RefreshCcw />
                    Restore
                  </Button>
                )}
                <ConfirmDialog
                  title="Move to trash?"
                  description={`${document.title} will be hidden from the active list. You can restore it later.`}
                  confirmLabel="Move to trash"
                  onConfirm={() => deleteDoc.mutateAsync(document.id)}
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash2 />
                      Delete
                    </Button>
                  }
                />
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => void restore.mutateAsync(document.id)}>
                  <RefreshCcw />
                  Restore
                </Button>
                <ConfirmDialog
                  title="Delete forever?"
                  description="This permanently removes the document and its versions."
                  confirmLabel="Delete forever"
                  onConfirm={() => deleteForever.mutateAsync(document.id)}
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash2 />
                      Delete forever
                    </Button>
                  }
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Latest version · {latest.version}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-y-auto rounded-lg bg-muted/50 p-4 font-sans text-sm whitespace-pre-wrap text-foreground/90">
              {latest.content}
            </pre>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sharing</CardTitle>
              <CardDescription>
                {document.sharedWith.length} person{document.sharedWith.length === 1 ? "" : "s"} have access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {document.sharedWith.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This document is private.
                </p>
              ) : (
                <ul className="grid gap-1.5">
                  {document.sharedWith.map((email) => (
                    <li key={email} className="text-sm text-muted-foreground">
                      {email}
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setShareOpen(true)}>
                <Send />
                Manage sharing
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y text-sm">
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Owner</dt>
                  <dd className="font-medium">{document.owner}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Department</dt>
                  <dd className="font-medium">{document.department}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="font-medium">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="font-medium">
                    {new Date(document.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Versions</dt>
                  <dd className="font-medium tabular-nums">{document.versions.length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="grid gap-3">
        <h3 className="text-sm font-medium">Version history</h3>
        <DataTable
          columns={versionColumns}
          data={document.versions}
          emptyTitle="No versions"
          emptyDescription="Upload the first version of this document."
        />
      </section>

      <DocumentFormDialog
        open={editOpen}
        document={document}
        onOpenChange={setEditOpen}
      />
      {uploadOpen ? (
        <UploadVersionDialog
          key={document.id}
          document={document}
          onOpenChange={setUploadOpen}
        />
      ) : null}
      {shareOpen ? (
        <ShareDialog
          key={document.id}
          document={document}
          onOpenChange={setShareOpen}
        />
      ) : null}
    </div>
  );
}