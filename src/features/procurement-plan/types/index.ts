export type PlanStatus =
  "Draft" | "Submitted" | "Approved" | "In Progress" | "Completed" | "Rejected";

export interface ProcurementPlan {
  id: string;
  ref: string;
  title: string;
  fiscalYear: string;
  department: string;
  category: string;
  budget: number;
  estimatedCost: number;
  plannedDate: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    estimatedCost: number;
  }[];
  status: PlanStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
