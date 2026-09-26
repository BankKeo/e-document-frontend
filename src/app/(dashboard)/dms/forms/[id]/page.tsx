import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { FormBuilder } from "@/features/dms-form/components/form-builder";

export const metadata: Metadata = {
  title: "Form builder — e-Document",
};

export default async function FormBuilderRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Form builder"
        description="Design fields, validation, and preview the live form."
      />
      <FormBuilder id={id} />
    </div>
  );
}
