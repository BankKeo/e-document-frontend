export type TenderStatus =
  | "Draft"
  | "Published"
  | "Open for Bids"
  | "Bids Closed"
  | "Under Evaluation"
  | "Award Recommendation"
  | "Awarded"
  | "Cancelled";

export interface TenderDocument {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface TenderSchedule {
  publish: string;
  bidSubmission: string;
  bidOpening: string;
  evaluation: string;
  award: string;
}

export interface TenderBid {
  id: string;
  supplier: string;
  amount: number;
  submittedAt: string;
  technicalScore?: number;
  financialScore?: number;
  totalScore?: number;
  status:
    "Submitted" | "Compliant" | "Non-Compliant" | "Shortlisted" | "Awarded";
}

export interface Tender {
  id: string;
  ref: string;
  title: string;
  category: string;
  status: TenderStatus;
  description: string;
  estimatedValue: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
  documents: TenderDocument[];
  schedule: TenderSchedule;
  bids: TenderBid[];
  evaluationCommittee: string[];
}
