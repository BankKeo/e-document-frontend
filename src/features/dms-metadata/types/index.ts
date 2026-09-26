export interface MetaRecord {
  id: string;
  documentTitle: string;
  documentNumber: string; // DMS-META-001
  documentType: string; // DMS-META-002
  category: string; // DMS-META-003
  department: string; // DMS-META-004
  author: string; // DMS-META-005
  createdAt: string; // DMS-META-006
  confidentiality: string; // DMS-META-007
  tags: string[]; // DMS-META-008
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface TagDefinition {
  id: string;
  name: string;
  count: number;
}

export interface ConfidentialityLevel {
  id: string;
  label: string;
  description: string;
}

export interface NumberingScheme {
  prefix: string;
  includeYear: boolean;
  counter: number;
}