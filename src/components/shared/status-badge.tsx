import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const STATUS_STYLES: Record<string, BadgeVariant> = {
  Draft: "secondary",
  Pending: "outline",
  "Pending Approval": "outline",
  "In Review": "outline",
  Submitted: "default",
  Approved: "default",
  Verified: "default",
  Active: "default",
  "In Stock": "default",
  "In Progress": "default",
  Published: "default",
  Rejected: "destructive",
  "Out of Stock": "destructive",
  Expired: "destructive",
  Cancelled: "secondary",
  Deleted: "secondary",
  Archived: "secondary",
};

const DEFAULT_STATUS_VARIANT: BadgeVariant = "secondary";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_STYLES[status] ?? DEFAULT_STATUS_VARIANT}>
      {status}
    </Badge>
  );
}
