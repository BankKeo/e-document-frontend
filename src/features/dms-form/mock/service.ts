import { MOCK_FORMS, MOCK_FORM_SUBMISSIONS } from "./data";
import type {
  EFormField,
  EFormSubmission,
  EFormTemplate,
  FormFieldType,
} from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let forms: EFormTemplate[] = [...MOCK_FORMS];
let submissions: EFormSubmission[] = [...MOCK_FORM_SUBMISSIONS];

const CURRENT_ACTOR = "Malina Phetxomphou";

export const formService = {
  async listForms(): Promise<EFormTemplate[]> {
    await delay();
    return forms.map((entry) => ({ ...entry, fields: [...entry.fields] }));
  },

  async getForm(id: string): Promise<EFormTemplate> {
    await delay(200);
    const form = forms.find((entry) => entry.id === id);
    if (!form) throw new Error("Form not found.");
    const subs = submissions.filter((entry) => entry.formId === id);
    return {
      ...form,
      fields: [...form.fields],
      submissions: subs.map((entry) => ({ ...entry })),
    };
  },

  // FORM-001 — Create form (starts with a title; builder adds fields)
  async createForm(input: {
    name: string;
    description?: string;
    category: string;
    fields: { type: FormFieldType; label: string; required: boolean }[];
  }): Promise<EFormTemplate> {
    await delay(450);
    const created: EFormTemplate = {
      id: randomId("form"),
      name: input.name.trim(),
      description: input.description?.trim() || "",
      category: input.category,
      status: "Draft",
      version: "v0.1",
      owner: CURRENT_ACTOR,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
      fields: input.fields.map((field) => ({
        ...field,
        id: randomId("f"),
        placeholder: "",
        options:
          field.type === "Dropdown" ? ["Option A", "Option B"] : undefined,
      })),
    };
    forms = [created, ...forms];
    return { ...created };
  },

  // FORM-002 — Form builder: replace field set
  async updateFields(id: string, fields: EFormField[]): Promise<EFormTemplate> {
    await delay(400);
    const index = forms.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Form not found.");
    const existing = forms[index];
    const next: EFormTemplate = {
      ...existing,
      fields: fields.map((field) => ({
        ...field,
        id: field.id || randomId("f"),
      })),
      updatedAt: new Date().toISOString(),
    };
    forms = forms.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },

  async deleteForm(id: string): Promise<void> {
    await delay(300);
    forms = forms.filter((entry) => entry.id !== id);
  },

  async publishForm(id: string): Promise<EFormTemplate> {
    await delay(400);
    const index = forms.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Form not found.");
    const existing = forms[index];
    const available =
      existing.status === "Draft" || existing.status === "Archived";
    const next: EFormTemplate = {
      ...existing,
      status: available ? "Published" : "Archived",
      version: available ? bumpVersion(existing.version) : existing.version,
      updatedAt: new Date().toISOString(),
    };
    forms = forms.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },

  // FORM-012 — Submit
  async submitForm(
    formId: string,
    values: Record<string, string>
  ): Promise<EFormSubmission> {
    await delay(400);
    const submission: EFormSubmission = {
      id: randomId("sub"),
      formId,
      at: new Date().toISOString(),
      actor: CURRENT_ACTOR,
      values: { ...values },
    };
    submissions = [submission, ...submissions];
    return { ...submission };
  },
};

function bumpVersion(version: string): string {
  const minor = Number(version.split(".")[1] ?? "0");
  return `v${Math.floor(minor / 10)}.${minor + 1}`;
}
