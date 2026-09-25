import { OrganizationNav } from "@/features/organization/components/organization-nav";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <OrganizationNav />
      {children}
    </div>
  );
}