export type TaskStatus = "Open" | "In Progress" | "Done" | "Overdue";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface TaskComment {
  id: string;
  at: string;
  author: string;
  text: string;
}

export interface Task {
  id: string;
  ref: string;
  title: string;
  description: string;
  assignee: string;
  creator: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  reminderAt?: string;
  attachments: { id: string; name: string; size: number }[];
  comments: TaskComment[];
  relatedTo?: string;
  createdAt: string;
  updatedAt: string;
}
