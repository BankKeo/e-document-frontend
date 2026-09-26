import { MetadataNav } from "@/features/dms-metadata/components/metadata-nav";

export default function MetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <MetadataNav />
      {children}
    </div>
  );
}