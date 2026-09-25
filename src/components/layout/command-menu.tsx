"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandMenu } from "@/components/layout/command-menu-context";
import { sidebarItems, type NavItem } from "@/config/navigation";
import { FileText, type LucideIcon } from "lucide-react";

type SearchResult = {
  group: string;
  icon: LucideIcon;
  label: string;
  detail?: string;
  href: string;
};

const RECORD_RESULTS: SearchResult[] = [
  {
    group: "Documents",
    icon: FileText,
    label: "ABC Contract 2026",
    detail: "DMS-2026-0041",
    href: "/dms/documents/abc-contract-2026",
  },
  {
    group: "Suppliers",
    icon: FileText,
    label: "ABC Trading",
    detail: "Verified supplier",
    href: "/procurement/suppliers/abc-trading",
  },
  {
    group: "Purchase Requisitions",
    icon: FileText,
    label: "PR-2026-00231",
    detail: "Pending approval",
    href: "/procurement/requisitions/pr-2026-00231",
  },
  {
    group: "Contracts",
    icon: FileText,
    label: "Office lease 2026",
    detail: "Active",
    href: "/procurement/contracts/office-lease-2026",
  },
  {
    group: "Inventory",
    icon: FileText,
    label: "ABC Printer Toner",
    detail: "PRT-001",
    href: "/warehouse/inventory/prt-001",
  },
];

function NavItemResult({ nav }: { nav: NavItem }) {
  const router = useRouter();
  const { setOpen } = useCommandMenu();
  const Icon = nav.icon;

  return (
    <CommandItem
      value={`${nav.title} ${nav.keywords?.join(" ") ?? ""}`}
      onSelect={() => {
        router.push(nav.href);
        setOpen(false);
      }}
    >
      <Icon />
      <span>{nav.title}</span>
    </CommandItem>
  );
}

export function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const router = useRouter();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search documents, suppliers, requisitions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {sidebarItems.map((item) => (
            <NavItemResult key={item.href} nav={item} />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          {RECORD_RESULTS.map((result) => (
            <CommandItem
              key={`${result.group}-${result.label}`}
              value={result.label}
              onSelect={() => {
                router.push(result.href);
                setOpen(false);
              }}
            >
              <result.icon />
              <span>{result.label}</span>
              {result.detail ? (
                <span className="ml-auto text-xs text-muted-foreground">
                  {result.detail}
                </span>
              ) : null}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
