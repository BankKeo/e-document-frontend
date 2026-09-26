import type { LucideIcon } from "lucide-react";
import {
  CircleCheckBig,
  CopyCheck,
  Flag,
  GitBranch,
  GitFork,
  Play,
  SearchCheck,
} from "lucide-react";
import type { WorkflowNodeType } from "../types";

export const NODE_META: Record<
  WorkflowNodeType,
  { label: string; icon: LucideIcon; description: string }
> = {
  Start: {
    label: "Start",
    icon: Play,
    description: "Entry point for the workflow.",
  },
  Approval: {
    label: "Approval",
    icon: CopyCheck,
    description: "A named approver or role must approve.",
  },
  Review: {
    label: "Review",
    icon: SearchCheck,
    description: "A reviewer checks and can comment.",
  },
  Conditional: {
    label: "Conditional",
    icon: GitBranch,
    description: "Routes by a condition or threshold.",
  },
  Parallel: {
    label: "Parallel",
    icon: GitFork,
    description: "Runs several tasks at the same time.",
  },
  Notification: {
    label: "Notification",
    icon: Flag,
    description: "Sends a notification to someone.",
  },
  End: {
    label: "End",
    icon: CircleCheckBig,
    description: "Workflow completes here.",
  },
};
