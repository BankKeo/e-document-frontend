"use client";

import * as React from "react";
import { Menu, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { BellMenu } from "@/components/layout/bell-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { useCommandMenu } from "@/components/layout/command-menu-context";

export function Topbar() {
  const { setOpen: setCommandOpen } = useCommandMenu();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="lg:hidden" />
          }
        >
          <Menu className="size-4" />
          <span className="sr-only">Open navigation</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              E
            </div>
            <span className="text-sm font-medium tracking-tight">
              e-Document
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>

      <Breadcrumbs className="min-w-0 flex-1" />

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-9 items-center gap-2 justify-self-end text-muted-foreground lg:w-56"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="size-4" />
          <span className="hidden flex-1 text-left text-sm lg:inline">
            Search...
          </span>
          <kbd className="pointer-events-none hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <BellMenu />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
