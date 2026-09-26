"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FileStack, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useWorkflow, useWorkflowVersions } from "../api/workflow.queries";
import { WorkflowFlow } from "./workflow-flow";
import { WorkflowFormDialog } from "./workflow-form-dialog";

export function WorkflowDetail({ id }: { id: string }) {
  const { data: workflow, isPending, isError, refetch } = useWorkflow(id);
  const { data: versions } = useWorkflowVersions(id);
  const [editOpen, setEditOpen] = React.useState(false);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading workflow…
      </div>
    );
  }

  if (isError || !workflow) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load workflow</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/dms/workflows"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to workflows
          </Link>
        </div>
      </div>
    );
  }

  const history = versions && versions.length > 0 ? versions : [];

  return (
    <div className="grid gap-6">
      <Link
        href="/dms/workflows"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to workflows
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {workflow.name}
              </h2>
              <StatusBadge status={workflow.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {workflow.category} · {workflow.version}
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {workflow.description || "No description provided."}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="outline">{workflow.nodes.length} nodes</Badge>
              <Badge variant="secondary">{workflow.owner}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit workflow
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flow</CardTitle>
            <CardDescription>
              Ordered node sequence (WF-010 … WF-016).
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[36rem] overflow-y-auto pr-1">
            <WorkflowFlow workflow={workflow} />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Version history</CardTitle>
              <CardDescription>
                Workflow definitions are versioned (WF-005).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {history.map((entry) => (
                  <li
                    key={`${entry.version}-${entry.summary}`}
                    className="flex items-start gap-3 py-2.5"
                  >
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileStack className="size-3 text-muted-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        <span className="font-mono">{entry.version}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {new Date(entry.at).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.actor} — {entry.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Node types</CardTitle>
              <CardDescription>
                All node kinds supported by the designer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-2 text-sm">
                {workflow.nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="flex justify-between rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <dt className="font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </dt>
                    <dd className="font-medium">{node.type}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <WorkflowFormDialog
        open={editOpen}
        workflow={workflow}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
