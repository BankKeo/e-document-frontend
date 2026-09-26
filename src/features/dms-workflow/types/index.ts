export type WorkflowStatus = "Draft" | "Published" | "Archived";

export type WorkflowNodeType =
  | "Start"
  | "Approval"
  | "Review"
  | "Conditional"
  | "Parallel"
  | "Notification"
  | "End";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description?: string;
  assignee?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  status: WorkflowStatus;
  version: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
}

export interface WorkflowVersion {
  id: string;
  version: string;
  at: string;
  actor: string;
  summary: string;
}
