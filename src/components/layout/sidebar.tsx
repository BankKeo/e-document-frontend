"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOME, navigationGroups, type NavItem } from "@/config/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function SidebarItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link}>
        <span className="sr-only">{item.title}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
      <div className="flex flex-col gap-6">
        <ul className="flex flex-col gap-0.5">
          <li>
            <SidebarItem item={HOME} collapsed={collapsed} />
          </li>
        </ul>
        {navigationGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            {!collapsed && (
              <p className="px-2 pb-1 text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <SidebarItem item={item} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
