import {
  MOCK_WORKFLOWS,
  MOCK_WORKFLOW_CATEGORIES,
  MOCK_WORKFLOW_VERSIONS,
} from "./data";
import type {
  WorkflowDefinition,
  WorkflowNodeType,
  WorkflowVersion,
} from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let workflows: WorkflowDefinition[] = [...MOCK_WORKFLOWS];

const CURRENT_ACTOR = "Malina Phetxomphou";

export const workflowService = {
  async listWorkflows(): Promise<WorkflowDefinition[]> {
    await delay();
    return workflows.map((entry) => ({ ...entry, nodes: [...entry.nodes] }));
  },

  async getWorkflow(id: string): Promise<WorkflowDefinition> {
    await delay(200);
    const workflow = workflows.find((entry) => entry.id === id);
    if (!workflow) throw new Error("Workflow not found.");
    return { ...workflow, nodes: [...workflow.nodes] };
  },

  async createWorkflow(input: {
    name: string;
    description?: string;
    category: string;
    nodes: {
      type: WorkflowNodeType;
      title: string;
      description?: string;
      assignee?: string;
    }[];
  }): Promise<WorkflowDefinition> {
    await delay(450);
    const created: WorkflowDefinition = {
      id: randomId("wf"),
      name: input.name.trim(),
      description: input.description?.trim() || "",
      category: input.category,
      status: "Draft",
      version: "v0.1",
      owner: CURRENT_ACTOR,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
      nodes: input.nodes.map((node) => ({ ...node, id: randomId("node") })),
    };
    workflows = [created, ...workflows];
    return { ...created };
  },

  async updateWorkflow(
    id: string,
    input: {
      name?: string;
      description?: string;
      category?: string;
      nodes?: {
        type: WorkflowNodeType;
        title: string;
        description?: string;
        assignee?: string;
      }[];
    }
  ): Promise<WorkflowDefinition> {
    await delay(450);
    const index = workflows.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Workflow not found.");
    const existing = workflows[index];
    const next: WorkflowDefinition = {
      ...existing,
      name: input.name?.trim() ?? existing.name,
      description: input.description?.trim() ?? existing.description,
      category: input.category ?? existing.category,
      updatedAt: new Date().toISOString(),
      nodes: input.nodes
        ? input.nodes.map((node) => ({ ...node, id: randomId("node") }))
        : existing.nodes,
    };
    workflows = workflows.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },

  // WF-003 — Delete
  async deleteWorkflow(id: string): Promise<void> {
    await delay(300);
    workflows = workflows.filter((entry) => entry.id !== id);
  },

  // WF-004 — Publish (or unpublish back to draft)
  async publishWorkflow(id: string): Promise<WorkflowDefinition> {
    await delay(400);
    const index = workflows.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Workflow not found.");
    const existing = workflows[index];
    const next: WorkflowDefinition = {
      ...existing,
      status: existing.status === "Published" ? "Draft" : "Published",
      updatedAt: new Date().toISOString(),
    };
    workflows = workflows.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },

  // WF-005 — Versioning: bump a new minor version snapshot
  async createWorkflowVersion(
    id: string,
    summary: string
  ): Promise<WorkflowDefinition> {
    await delay(400);
    const index = workflows.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Workflow not found.");
    const existing = workflows[index];
    const next: WorkflowDefinition = {
      ...existing,
      version: bumpVersion(existing.version),
      updatedAt: new Date().toISOString(),
    };
    workflows = workflows.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    const versions: WorkflowVersion[] =
      MOCK_WORKFLOW_VERSIONS[id] ?? (MOCK_WORKFLOW_VERSIONS[id] = []);
    versions.push({
      id: randomId("wv"),
      version: next.version,
      at: new Date().toISOString(),
      actor: CURRENT_ACTOR,
      summary: summary.trim() || "New version snapshot",
    });
    return { ...next };
  },

  async listWorkflowVersions(id: string): Promise<WorkflowVersion[]> {
    await delay(150);
    return [...(MOCK_WORKFLOW_VERSIONS[id] ?? [])];
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_WORKFLOW_CATEGORIES];
  },
};

function bumpVersion(version: string): string {
  const minor = Number(version.split(".")[1] ?? "0");
  return `v${Math.floor(minor / 10)}.${minor + 1}`;
}
