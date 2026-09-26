import { MOCK_TASKS } from "./data";
import type { Task, TaskComment, TaskPriority, TaskStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let tasks: Task[] = [...MOCK_TASKS];

let refCounter = 1007;

const CURRENT_ACTOR = "Malina Phetxomphou";

function nextRef(): string {
  return `TASK-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(task: Task): Task {
  return {
    ...task,
    attachments: [...task.attachments],
    comments: [...task.comments],
  };
}

export const taskService = {
  async listTasks(): Promise<Task[]> {
    await delay();
    return tasks.map(shallow);
  },

  async getTask(id: string): Promise<Task> {
    await delay(200);
    const task = tasks.find((entry) => entry.id === id);
    if (!task) throw new Error("Task not found.");
    return shallow(task);
  },

  // TASK-001 — Create
  async createTask(input: {
    title: string;
    description: string;
    assignee: string;
    priority: TaskPriority;
    dueDate: string;
  }): Promise<Task> {
    await delay(450);
    const created: Task = {
      id: randomId("task"),
      ref: nextRef(),
      title: input.title.trim(),
      description: input.description.trim(),
      assignee: input.assignee,
      creator: CURRENT_ACTOR,
      priority: input.priority,
      status: "Open",
      dueDate: input.dueDate,
      attachments: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks = [created, ...tasks];
    return shallow(created);
  },

  // TASK-002 — Assign / reassign
  async assignTask(id: string, assignee: string): Promise<Task> {
    await delay(300);
    const index = tasks.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Task not found.");
    const next: Task = {
      ...tasks[index],
      assignee,
      updatedAt: new Date().toISOString(),
    };
    tasks = tasks.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // TASK-005 — Status
  async setStatus(id: string, status: TaskStatus): Promise<Task> {
    await delay(300);
    const index = tasks.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Task not found.");
    const next: Task = {
      ...tasks[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    tasks = tasks.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // TASK-006 — Add comment
  async addComment(id: string, text: string): Promise<Task> {
    await delay(300);
    const index = tasks.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Task not found.");
    const comment: TaskComment = {
      id: randomId("c"),
      at: new Date().toISOString(),
      author: CURRENT_ACTOR,
      text: text.trim(),
    };
    const next: Task = {
      ...tasks[index],
      comments: [...tasks[index].comments, comment],
      updatedAt: new Date().toISOString(),
    };
    tasks = tasks.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async requestReminder(id: string): Promise<Task> {
    await delay(250);
    const index = tasks.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Task not found.");
    const next: Task = {
      ...tasks[index],
      reminderAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
    };
    tasks = tasks.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },
};
