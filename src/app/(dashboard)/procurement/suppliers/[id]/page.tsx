import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierDetail } from "@/features/procurement-supplier/components/supplier-detail";
import { MOCK_SUPPLIERS } from "@/features/procurement-supplier/mock/data";

export const metadata: Metadata = {
  title: "Supplier details — e-Document",
};

export function generateStaticParams() {
  return MOCK_SUPPLIERS.map((supplier) => ({ id: supplier.id }));
}

export default async function SupplierDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Supplier details"
        description="Lifecycle, contacts, bank information, and documents."
      />
      <SupplierDetail id={id} />
    </div>
  );
}
