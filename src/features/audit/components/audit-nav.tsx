"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { title: "Login History", href: "/admin/audit" },
  { title: "User Activity", href: "/admin/audit/activity" },
  { title: "Documents", href: "/admin/audit/documents" },
  { title: "Approvals", href: "/admin/audit/approvals" },
  { title: "Procurement", href: "/admin/audit/procurement" },
  { title: "Inventory", href: "/admin/audit/inventory" },
  { title: "Data Changes", href: "/admin/audit/data-changes" },
];

const HOME = "/admin/audit";

export function AuditNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Audit logs" className="w-full overflow-x-auto">
      <div className="flex w-max min-w-full items-center gap-1 rounded-lg bg-muted p-[3px]">
        {ITEMS.map((item) => {
          const active =
            item.href === HOME
              ? pathname === HOME
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
                active && "bg-background text-foreground shadow-sm"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}