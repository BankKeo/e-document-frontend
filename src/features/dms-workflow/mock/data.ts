import type { WorkflowDefinition, WorkflowVersion } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: "wf_pr_approval",
    name: "Purchase Requisition Approval",
    description:
      "Routes a purchase requisition through department approval, budget validation, and final procurement authorization.",
    category: "Procurement",
    status: "Published",
    version: "v2.3",
    owner: "Aloun Sisavath",
    createdAt: "2025-11-10",
    updatedAt: ago(120),
    nodes: [
      { id: "n1", type: "Start", title: "PR Submitted" },
      {
        id: "n2",
        type: "Approval",
        title: "Department Approval",
        assignee: "Department Head",
      },
      {
        id: "n3",
        type: "Approval",
        title: "Budget Check",
        assignee: "Finance",
      },
      {
        id: "n4",
        type: "Conditional",
        title: "Over threshold?",
        description: "> 50M LAK routed to Procurement Director",
      },
      {
        id: "n5",
        type: "Approval",
        title: "Procurement Authorization",
        assignee: "Procurement",
      },
      { id: "n6", type: "Notification", title: "Requester notified" },
      { id: "n7", type: "End", title: "Complete" },
    ],
  },
  {
    id: "wf_tender_eval",
    name: "Tender Evaluation",
    description:
      "Manages the tender opening, technical and financial evaluation, and award recommendation workflow.",
    category: "Procurement",
    status: "Published",
    version: "v1.0",
    owner: "Kham Anoulack",
    createdAt: "2026-01-05",
    updatedAt: ago(300),
    nodes: [
      { id: "n1", type: "Start", title: "Bids Closed" },
      { id: "n2", type: "Notification", title: "Bid Opening Committee" },
      {
        id: "n3",
        type: "Review",
        title: "Technical Evaluation",
        assignee: "Evaluation Committee",
      },
      {
        id: "n4",
        type: "Parallel",
        title: "Financial + Compliance",
        description: "Parallel reviews",
      },
      {
        id: "n5",
        type: "Conditional",
        title: "Above threshold?",
        description: "Needs tender board sign-off",
      },
      {
        id: "n6",
        type: "Review",
        title: "Award Recommendation",
        assignee: "Procurement",
      },
      { id: "n7", type: "End", title: "Awarded" },
    ],
  },
  {
    id: "wf_contract_sign",
    name: "Contract Signing",
    description:
      "Validates contract terms, legal review, digital signature, and activation.",
    category: "Contracts",
    status: "Published",
    version: "v1.4",
    owner: "Malina Phetxomphou",
    createdAt: "2025-12-01",
    updatedAt: ago(900),
    nodes: [
      { id: "n1", type: "Start", title: "Contract Drafted" },
      { id: "n2", type: "Review", title: "Terms Review", assignee: "Legal" },
      {
        id: "n3",
        type: "Parallel",
        title: "Internal + Supplier review",
        description: "Comments collected in parallel",
      },
      {
        id: "n4",
        type: "Approval",
        title: "Management Approval",
        assignee: "Director",
      },
      {
        id: "n5",
        type: "Approval",
        title: "Digital Signature",
        assignee: "Authorized Signatory",
      },
      { id: "n6", type: "End", title: "Contract Active" },
    ],
  },
  {
    id: "wf_doc_review",
    name: "Document Review & Release",
    description:
      "Reviews controlled documents before release to the organisation.",
    category: "Documents",
    status: "Draft",
    version: "v0.2",
    owner: "Phoutthasone Keomany",
    createdAt: "2026-02-14",
    updatedAt: ago(60),
    nodes: [
      { id: "n1", type: "Start", title: "Draft" },
      {
        id: "n2",
        type: "Review",
        title: "Technical Review",
        assignee: "Author",
      },
      { id: "n3", type: "Approval", title: "Quality Approval", assignee: "QA" },
      { id: "n4", type: "Notification", title: "Reviewers notified" },
      { id: "n5", type: "End", title: "Released" },
    ],
  },
  {
    id: "wf_test",
    name: "Test Workflow",
    description: "Sandbox template for building new workflow definitions.",
    category: "Other",
    status: "Archived",
    version: "v0.1",
    owner: "Sengphet Vongdara",
    createdAt: "2025-09-01",
    updatedAt: ago(20000),
    nodes: [
      { id: "n1", type: "Start", title: "Start" },
      { id: "n2", type: "End", title: "End" },
    ],
  },
];

export const MOCK_WORKFLOW_CATEGORIES = [
  "Procurement",
  "Contracts",
  "Documents",
  "HR",
  "Finance",
  "Warehouse",
  "Other",
];

export const MOCK_WORKFLOW_VERSIONS: Record<string, WorkflowVersion[]> = {
  wf_pr_approval: [
    {
      id: "wv1",
      version: "v1.0",
      at: ago(50000),
      actor: "Aloun Sisavath",
      summary: "Initial definition",
    },
    {
      id: "wv2",
      version: "v2.0",
      at: ago(9000),
      actor: "Aloun Sisavath",
      summary: "Added budget check step",
    },
    {
      id: "wv3",
      version: "v2.3",
      at: ago(120),
      actor: "Aloun Sisavath",
      summary: "Threshold branching enabled",
    },
  ],
  wf_tender_eval: [
    {
      id: "wv1",
      version: "v1.0",
      at: ago(300),
      actor: "Kham Anoulack",
      summary: "Initial definition",
    },
  ],
  wf_contract_sign: [
    {
      id: "wv1",
      version: "v1.0",
      at: ago(5000),
      actor: "Malina Phetxomphou",
      summary: "Initial definition",
    },
    {
      id: "wv2",
      version: "v1.4",
      at: ago(900),
      actor: "Malina Phetxomphou",
      summary: "Parallel review step added",
    },
  ],
};
