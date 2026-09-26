import {
  BarChart3,
  Boxes,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  FormInput,
  Gavel,
  History,
  Home,
  LayoutDashboard,
  Lock,
  Package,
  PackageCheck,
  ScrollText,
  Settings,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
  Warehouse,
  Workflow,
  ArrowLeftRight,
  Bell,
  Tag,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  keywords?: string[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const HOME: NavItem = {
  title: "Dashboard",
  href: "/",
  icon: Home,
  description: "Executive overview across all modules.",
  keywords: ["home", "overview", "executive"],
};

const WORKSPACE: NavGroup = {
  label: "Workspace",
  items: [
    {
      title: "Documents",
      href: "/dms/documents",
      icon: FileText,
      description: "Browse, search, and manage electronic documents.",
      keywords: ["file", "contract", "upload", "pdf"],
    },
    {
      title: "Metadata",
      href: "/dms/metadata",
      icon: Tag,
      description: "Document types, categories, authors, tags, and numbering.",
      keywords: ["meta", "type", "category", "author", "tag", "numbering"],
    },
    {
      title: "Versioning",
      href: "/dms/versioning",
      icon: History,
      description: "Create, view, compare, and restore document versions.",
      keywords: ["version", "history", "compare", "restore"],
    },
    {
      title: "My Tasks",
      href: "/dms/tasks",
      icon: ClipboardList,
      description: "Approvals and actions assigned to you.",
      keywords: ["todo", "approve", "todo"],
    },
    {
      title: "Workflows",
      href: "/dms/workflows",
      icon: Workflow,
      description: "Design and monitor approval workflows.",
    },
    {
      title: "Forms",
      href: "/dms/forms",
      icon: FormInput,
      description: "Create and manage structured forms.",
    },
    {
      title: "Meetings",
      href: "/dms/meetings",
      icon: CalendarDays,
      description: "Schedule and record meeting minutes.",
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
      description: "In-app updates, approvals, reminders, and alerts.",
      keywords: ["alert", "notification", "inbox", "bell", "reminder"],
    },
  ],
};

const PROCUREMENT: NavGroup = {
  label: "Procurement",
  items: [
    {
      title: "Dashboard",
      href: "/procurement",
      icon: LayoutDashboard,
      description: "Procurement pipeline and spend overview.",
    },
    {
      title: "Procurement Plans",
      href: "/procurement/plans",
      icon: ClipboardList,
    },
    {
      title: "Purchase Requisitions",
      href: "/procurement/requisitions",
      icon: FileText,
    },
    {
      title: "Suppliers",
      href: "/procurement/suppliers",
      icon: Truck,
    },
    {
      title: "Tenders",
      href: "/procurement/tenders",
      icon: Gavel,
    },
    {
      title: "Contracts",
      href: "/procurement/contracts",
      icon: ScrollText,
    },
    {
      title: "Deliveries",
      href: "/procurement/deliveries",
      icon: PackageCheck,
    },
  ],
};

const WAREHOUSE: NavGroup = {
  label: "Warehouse",
  items: [
    {
      title: "Dashboard",
      href: "/warehouse",
      icon: LayoutDashboard,
      description: "Stock, inbound, and outbound overview.",
    },
    {
      title: "Inventory",
      href: "/warehouse/inventory",
      icon: Boxes,
    },
    {
      title: "Inbound",
      href: "/warehouse/inbound",
      icon: Truck,
    },
    {
      title: "Outbound",
      href: "/warehouse/outbound",
      icon: Package,
    },
    {
      title: "Warehouses",
      href: "/warehouse/warehouses",
      icon: Warehouse,
    },
    {
      title: "Stock Transfers",
      href: "/warehouse/transfers",
      icon: ArrowLeftRight,
    },
    {
      title: "Assets",
      href: "/warehouse/assets",
      icon: Building2,
    },
  ],
};

const ANALYTICS: NavGroup = {
  label: "Analytics",
  items: [
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Trends and reports across the org.",
    },
  ],
};

const ADMINISTRATION: NavGroup = {
  label: "Administration",
  items: [
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Roles & Permissions",
      href: "/admin/roles",
      icon: ShieldCheck,
      description: "Roles, permissions, and data access controls.",
      keywords: ["rbac", "role", "permission", "access", "security"],
    },
    {
      title: "Organization",
      href: "/admin/organization",
      icon: Building2,
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Audit Logs",
      href: "/admin/audit",
      icon: ScrollText,
    },
  ],
};

const ACCOUNT: NavGroup = {
  label: "Account",
  items: [
    {
      title: "Profile",
      href: "/account/profile",
      icon: UserRound,
      description: "Your account and organization details.",
      keywords: ["me", "account", "profile", "contact"],
    },
    {
      title: "Security",
      href: "/account/security",
      icon: Lock,
      description: "Password, sessions, and two-factor authentication.",
      keywords: ["password", "session", "mfa", "2fa", "security"],
    },
  ],
};

export const navigationGroups: NavGroup[] = [
  WORKSPACE,
  PROCUREMENT,
  WAREHOUSE,
  ANALYTICS,
  ADMINISTRATION,
  ACCOUNT,
];

export const sidebarItems: NavItem[] = [
  HOME,
  ...navigationGroups.flatMap((group) => group.items),
];

export function findNavItem(pathname: string): NavItem | undefined {
  const exact = sidebarItems.find((item) => item.href === pathname);
  if (exact) return exact;

  return sidebarItems
    .filter((item) => item.href !== "/")
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(`${item.href}/`));
}

export function findNavGroup(item: NavItem): NavGroup | undefined {
  return navigationGroups.find((group) => group.items.includes(item));
}

export function breadcrumbsFor(pathname: string): NavItem[] {
  const trail: NavItem[] = [];
  const current = findNavItem(pathname);
  if (!current) return trail;

  const segments = current.href.split("/").filter(Boolean);
  let href = "";
  for (const segment of segments) {
    href += `/${segment}`;
    const candidate = sidebarItems.find((item) => item.href === href);
    if (candidate) trail.push(candidate);
  }
  if (!trail.length) trail.push(current);
  return trail;
}
