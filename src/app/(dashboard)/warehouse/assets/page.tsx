import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AssetListPage } from "@/features/warehouse-asset/components/asset-list-page";

export const metadata: Metadata = {
  title: "Assets — e-Document",
};

export default function AssetsRoute() {
  return (
    <div>
      <PageHeader
        title="Assets"
        description="Register, assign, maintain, and depreciate company assets."
      />
      <AssetListPage />
    </div>
  );
}
