"use client";

import type { LucideIcon } from "lucide-react";
import {
  Ban,
  Clock,
  FileClock,
  Info,
  PackageX,
  ShieldCheck,
} from "lucide-react";
import type { Badge } from "@/components/ui/badge";
import type { NotificationKind } from "../types";

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

interface KindMeta {
  icon: LucideIcon;
  variant: BadgeVariant;
  label: string;
}

export const KIND_META: Record<NotificationKind, KindMeta> = {
  approval: { icon: ShieldCheck, variant: "default", label: "Approval" },
  rejection: { icon: Ban, variant: "destructive", label: "Rejection" },
  reminder: { icon: Clock, variant: "secondary", label: "Reminder" },
  contract: { icon: FileClock, variant: "outline", label: "Contract" },
  stock: { icon: PackageX, variant: "destructive", label: "Low stock" },
  system: { icon: Info, variant: "ghost", label: "System" },
};

export function formatRelative(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}