"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("app-shell/collapsed") === "true";
  });

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("app-shell/collapsed", String(next));
      }
      return next;
    });
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <aside
        data-collapsed={collapsed}
        className="hidden h-full shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex data-[collapsed=true]:w-16 data-[collapsed=false]:w-60"
      >
        <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            E
          </div>
          {!collapsed && (
            <span className="text-sm font-medium tracking-tight">
              e-Document
            </span>
          )}
        </div>
        <Sidebar collapsed={collapsed} />
        <div className="flex h-12 shrink-0 items-center justify-end border-t px-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleCollapsed}
                />
              }
            >
              <PanelLeft className="size-4" />
              <span className="sr-only">Toggle sidebar</span>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
