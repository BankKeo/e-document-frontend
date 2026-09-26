import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { VersioningPage } from "@/features/dms-versioning/components/versioning-page";

export const metadata: Metadata = {
  title: "Versioning — e-Document",
};

export default function VersioningRoute() {
  return (
    <div>
      <PageHeader
        title="Versioning"
        description="Create, view, compare, and restore document versions."
      />
      <VersioningPage />
    </div>
  );
}
