import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SupplierListPage } from "@/features/procurement-supplier/components/supplier-list-page";

export const metadata: Metadata = {
  title: "Suppliers — e-Document",
};

export default function SuppliersRoute() {
  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Register, verify, evaluate, and manage supplier partners."
      />
      <SupplierListPage />
    </div>
  );
}
