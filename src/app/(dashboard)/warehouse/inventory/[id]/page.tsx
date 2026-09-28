import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InventoryItemDetail } from "@/features/warehouse-inventory/components/inventory-item-detail";

export const metadata: Metadata = {
  title: "Inventory item details — e-Document",
};

export function generateStaticParams() {
  return [];
}

export default async function InventoryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Item details"
        description="Stock position, product master attributes, and movement history."
      />
      <InventoryItemDetail id={id} />
    </div>
  );
}
