import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ContractListPage } from "@/features/procurement-contract/components/contract-list-page";

export const metadata: Metadata = {
  title: "Contracts — e-Document",
};

export default function ContractsRoute() {
  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Create, sign, version, and manage contracts with suppliers."
      />
      <ContractListPage />
    </div>
  );
}
