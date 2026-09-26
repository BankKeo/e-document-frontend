import { z } from "zod";

export const metaRecordSchema = z.object({
  documentType: z.string().min(1, "Select a document type."),
  category: z.string().min(1, "Select a category."),
  department: z.string().min(1, "Select a department."),
  author: z.string().min(1, "Select an author."),
  confidentiality: z.string().min(1, "Select a confidentiality level."),
  tags: z.array(z.string()),
});

export type MetaRecordInput = z.infer<typeof metaRecordSchema>;

export const metaFieldsSchema = metaRecordSchema.omit({ tags: true });

export type MetaFieldsInput = z.infer<typeof metaFieldsSchema>;

export const documentTypeSchema = z.object({
  name: z.string().trim().min(2, "A type name is required.").max(60),
  description: z.string().trim().max(200).optional(),
});

export type DocumentTypeInput = z.infer<typeof documentTypeSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "A category name is required.").max(60),
  description: z.string().trim().max(200).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const authorSchema = z.object({
  name: z.string().trim().min(2, "An author name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  department: z.string().min(1, "Select a department."),
});

export type AuthorInput = z.infer<typeof authorSchema>;