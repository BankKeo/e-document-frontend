import {
  ArrowRight,
  Clock,
  FileText,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const attention = [
  {
    label: "12 documents waiting for approval",
    href: "/dms/tasks",
    icon: FileText,
  },
  {
    label: "5 purchase requisitions require review",
    href: "/procurement/requisitions",
    icon: ShoppingCart,
  },
  {
    label: "3 contracts expiring soon",
    href: "/procurement/contracts",
    icon: ArrowRight,
  },
  {
    label: "8 inventory items below reorder level",
    href: "/warehouse/inventory",
    icon: Package,
  },
];

const activity = [
  { time: "10:42 AM", text: "John approved PR-2026-001", meta: "Procurement" },
  { time: "09:31 AM", text: "Anna uploaded quotation.pdf", meta: "Documents" },
  { time: "Yesterday", text: "Finance requested changes", meta: "Procurement" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">
          Good morning, Malina
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your organization.
        </p>
      </header>

      <section
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        aria-label="Key metrics"
      >
        <KpiCard
          label="Pending Approvals"
          value="24"
          trend="8.2% from last month"
          icon={Clock}
        />
        <KpiCard
          label="Active Purchase Requests"
          value="17"
          trend="3.1% from last month"
          icon={ShoppingCart}
        />
        <KpiCard
          label="Low Stock Items"
          value="14"
          trend="Increase of 2"
          trendDirection="down"
          icon={Package}
        />
        <KpiCard
          label="Documents"
          value="1,284"
          trend="12.4% from last month"
          icon={FileText}
        />
      </section>

      <section
        aria-labelledby="attention-heading"
        className="grid gap-4 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle id="attention-heading">Attention Required</CardTitle>
            <Link
              href="/dms/tasks"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground"
              )}
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {attention.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 py-3 text-sm transition-colors hover:text-foreground"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <item.icon className="size-4" />
                    </span>
                    <span className="text-foreground/80">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-4">
              {activity.map((entry) => (
                <li
                  key={`${entry.time}-${entry.text}`}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {entry.time}
                    </p>
                    <p className="text-sm text-foreground/80">{entry.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.meta}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
