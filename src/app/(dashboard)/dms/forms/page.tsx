import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { FormListPage } from "@/features/dms-form/components/form-list-page";

export const metadata: Metadata = {
  title: "E-Forms — e-Document",
};

export default function FormsRoute() {
  return (
    <div>
      <PageHeader
        title="E-Forms"
        description="Design structured e-forms with fields, validation, and submissions."
      />
      <FormListPage />
    </div>
  );
}
