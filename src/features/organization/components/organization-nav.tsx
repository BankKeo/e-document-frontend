"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { title: "Overview", href: "/admin/organization" },
  { title: "Departments", href: "/admin/organization/departments" },
  { title: "Positions", href: "/admin/organization/positions" },
  { title: "Employees", href: "/admin/organization/employees" },
  { title: "Hierarchy", href: "/admin/organization/hierarchy" },
  { title: "Approval Authority", href: "/admin/organization/approval-authority" },
];

export function OrganizationNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Organization" className="w-full overflow-x-auto">
      <div className="flex w-max min-w-full items-center gap-1 rounded-lg bg-muted p-[3px]">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/organization" &&
              pathname.startsWith(`${item.href}/`));
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