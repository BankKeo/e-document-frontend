"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Loader2, Plus, Settings2, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormNav } from "./form-nav";
import { CreateFormDialog } from "./create-form-dialog";
import { useDeleteForm, useForms, usePublishForm } from "../api/form.queries";
import type { EFormTemplate } from "../types";

export function FormListPage() {
  const { data, isPending, isError, refetch } = useForms();
  const [createOpen, setCreateOpen] = React.useState(false);

  const columns = React.useMemo<ColumnDef<EFormTemplate>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Form",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/dms/forms/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.name}
            </Link>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.description}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.category}</Badge>
        ),
      },
      {
        accessorKey: "version",
        header: "Version",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.version}</span>
        ),
      },
      {
        accessorKey: "fields",
        header: "Fields",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.fields.length}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <FormRowActions form={row.original} />,
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load forms.</p>
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
      <FormNav />
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New form
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="name"
        searchPlaceholder="Search forms..."
        emptyTitle="No forms"
        emptyDescription="Create your first form template to get started."
      />

      {createOpen ? (
        <CreateFormDialog open onOpenChange={setCreateOpen} />
      ) : null}
    </div>
  );
}

function FormRowActions({ form }: { form: EFormTemplate }) {
  const publish = usePublishForm();
  const deleteForm = useDeleteForm();

  return (
    <div className="flex flex-wrap justify-end gap-1">
      <Link
        href={`/dms/forms/${form.id}`}
        className="inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
      >
        <Settings2 className="size-4" />
        Builder
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={() => void publish.mutateAsync(form.id)}
        disabled={publish.isPending}
      >
        {publish.isPending && <Loader2 className="animate-spin" />}
        {form.status === "Published" ? "Archive" : "Publish"}
      </Button>
      <ConfirmDialog
        title="Delete form?"
        description={`${form.name} and its submissions will be removed.`}
        confirmLabel="Delete"
        onConfirm={() => deleteForm.mutateAsync(form.id)}
        trigger={
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}
