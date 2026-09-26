import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InventoryItemDetail } from "@/features/warehouse-inventory/components/inventory-item-detail";

export const metadata: Metadata = {
  title: "Item details — e-Document",
};

export default async function InventoryItemDetailRoute({
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
