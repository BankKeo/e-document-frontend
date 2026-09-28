import { notFound } from "next/navigation";
import { Construction } from "lucide-react";
import { findNavItem, sidebarItems } from "@/config/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export function generateStaticParams() {
  return sidebarItems
    .filter((item) => item.href !== "/")
    .map((item) => ({
      slug: item.href.split("/").filter(Boolean),
    }));
}

export default async function ModulePlaceholder({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const item = findNavItem(pathname);

  if (!item) notFound();

  return (
    <div>
      <PageHeader title={item.title} description={item.description} />
      <EmptyState
        icon={Construction}
        title={`${item.title} is under construction`}
        description="The design system and architecture are ready. This module will be implemented in a later phase."
      />
    </div>
  );
}
