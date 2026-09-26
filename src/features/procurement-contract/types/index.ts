export type ContractStatus =
  | "Draft"
  | "Review"
  | "Approval"
  | "Signing"
  | "Active"
  | "Expired"
  | "Completed"
  | "Terminated";

export interface ContractVersion {
  id: string;
  version: string;
  at: string;
  actor: string;
  summary: string;
}

export interface ContractAmendment {
  id: string;
  at: string;
  title: string;
  note: string;
}

export interface Contract {
  id: string;
  ref: string;
  title: string;
  type: string;
  supplier: string;
  value: number;
  startDate: string;
  endDate: string;
  owner: string;
  status: ContractStatus;
  signed?: boolean;
  documents: { id: string; name: string; size: number }[];
  versions?: ContractVersion[];
  amendments?: ContractAmendment[];
  createdAt: string;
  updatedAt: string;
}

export function contractStatusFromDates(
  start: string,
  end: string,
  base: ContractStatus
): ContractStatus {
  if (
    base === "Draft" ||
    base === "Review" ||
    base === "Approval" ||
    base === "Signing"
  )
    return base;
  const today = Date.now();
  if (new Date(end).getTime() < today) return "Expired";
  if (new Date(start).getTime() <= today && new Date(end).getTime() >= today)
    return "Active";
  return "Active";
}
