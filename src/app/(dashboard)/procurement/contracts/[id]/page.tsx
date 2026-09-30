import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ContractDetail } from "@/features/procurement-contract/components/contract-detail";
import { MOCK_CONTRACTS } from "@/features/procurement-contract/mock/data";

export const metadata: Metadata = {
  title: "Contract details — e-Document",
};

export function generateStaticParams() {
  return MOCK_CONTRACTS.map((contract) => ({ id: contract.id }));
}

export default async function ContractDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Contract details"
        description="Lifecycle, versions, amendments, and terms."
      />
      <ContractDetail id={id} />
    </div>
  );
}
