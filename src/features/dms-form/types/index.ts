export type FormStatus = "Draft" | "Published" | "Archived";

export type FormFieldType =
  | "Text"
  | "Number"
  | "Date"
  | "Dropdown"
  | "Checkbox"
  | "File Upload"
  | "Signature";

export interface EFormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  condition?: string;
}

export interface EFormSubmission {
  id: string;
  formId: string;
  at: string;
  actor: string;
  values: Record<string, string>;
}

export interface EFormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  status: FormStatus;
  version: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  fields: EFormField[];
  submissions?: EFormSubmission[];
}
