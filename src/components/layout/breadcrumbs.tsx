"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadcrumbsFor } from "@/config/navigation";

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const items = breadcrumbsFor(pathname);

  if (!items.length) return <div className={className} />;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <BreadcrumbItem key={item.href} className="hidden sm:inline-flex">
              {isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink
                    render={<Link href={item.href} />}
                    className="text-muted-foreground"
                  >
                    {item.title}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
