"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { title: "Roles", href: "/admin/roles" },
  { title: "Permissions", href: "/admin/roles/permissions" },
  { title: "User Roles", href: "/admin/roles/users" },
];

const SUB_ROUTES = ["/admin/roles/permissions", "/admin/roles/users"];

export function RbacNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Roles & permissions" className="w-full overflow-x-auto">
      <div className="flex w-max min-w-full items-center gap-1 rounded-lg bg-muted p-[3px]">
        {ITEMS.map((item) => {
          const active =
            item.href === "/admin/roles"
              ? pathname === "/admin/roles" ||
                (pathname.startsWith("/admin/roles/") &&
                  !SUB_ROUTES.some((route) => pathname.startsWith(route)))
              : pathname.startsWith(item.href);
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