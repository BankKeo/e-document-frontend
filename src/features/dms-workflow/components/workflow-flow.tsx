"use client";

import { cn } from "@/lib/utils";
import type { WorkflowDefinition } from "../types";
import { NODE_META } from "./node-meta";

export function WorkflowFlow({ workflow }: { workflow: WorkflowDefinition }) {
  return (
    <ol className="flex flex-col items-stretch gap-0">
      {workflow.nodes.map((node, index) => {
        const meta = NODE_META[node.type];
        const Icon = meta.icon;
        return (
          <li key={node.id} className="relative">
            {index > 0 ? (
              <span
                aria-hidden
                className="absolute top-0 left-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-full bg-border"
              />
            ) : null}
            <div
              className={cn(
                "rounded-lg border bg-card p-3",
                node.type === "Start" && "border-primary/40",
                node.type === "End" && "border-emerald-500/40"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md",
                    node.type === "Start" && "bg-primary/10 text-primary",
                    node.type === "End" &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    node.type !== "Start" &&
                      node.type !== "End" &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs text-muted-foreground">
                      {index + 1}.
                    </p>
                    <p className="truncate text-sm font-medium">{node.title}</p>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {node.description || meta.description}
                    {node.assignee ? ` · ${node.assignee}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
