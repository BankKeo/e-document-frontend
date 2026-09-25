import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DepartmentsPage } from "@/features/organization/components/departments-page";

export const metadata: Metadata = {
  title: "Departments — e-Document",
};

export default function DepartmentsRoute() {
  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage departments and their reporting structure."
      />
      <DepartmentsPage />
    </div>
  );
}