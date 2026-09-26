import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TransferListPage } from "@/features/warehouse-transfer/components/transfer-list-page";

export const metadata: Metadata = {
  title: "Stock Transfers — e-Document",
};

export default function TransfersRoute() {
  return (
    <div>
      <PageHeader
        title="Stock transfers"
        description="Move stock between warehouses with full traceability."
      />
      <TransferListPage />
    </div>
  );
}
