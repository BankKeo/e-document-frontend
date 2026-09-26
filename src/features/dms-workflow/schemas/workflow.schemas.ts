import { z } from "zod";

export const workflowNodeSchema = z.object({
  type: z.enum([
    "Start",
    "Approval",
    "Review",
    "Conditional",
    "Parallel",
    "Notification",
    "End",
  ]),
  title: z.string().trim().min(1, "Node title is required.").max(120),
  description: z.string().trim().max(300).optional(),
  assignee: z.string().trim().max(80).optional(),
});

export const workflowFormSchema = z.object({
  name: z.string().trim().min(2, "A workflow name is required.").max(160),
  category: z.string().min(1, "Select a category."),
  description: z.string().trim().max(2000).optional(),
  nodes: z
    .array(workflowNodeSchema)
    .min(2, "Add at least start and end nodes."),
});

export type WorkflowFormInput = z.infer<typeof workflowFormSchema>;
