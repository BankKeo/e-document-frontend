import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmployeesPage } from "@/features/organization/components/employees-page";

export const metadata: Metadata = {
  title: "Employees — e-Document",
};

export default function EmployeesRoute() {
  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage employees, positions, and reporting lines."
      />
      <EmployeesPage />
    </div>
  );
}