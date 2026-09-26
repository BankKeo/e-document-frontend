"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { title: "Inbox", href: "/notifications" },
  { title: "Approvals", href: "/notifications/approvals" },
  { title: "Rejections", href: "/notifications/rejections" },
  { title: "Reminders", href: "/notifications/reminders" },
  { title: "Contracts", href: "/notifications/contracts" },
  { title: "Stock", href: "/notifications/stock" },
  { title: "Email", href: "/notifications/email" },
];

const HOME = "/notifications";

export function NotificationNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Notifications" className="w-full overflow-x-auto">
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