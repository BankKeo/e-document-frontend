import { z } from "zod";

export const documentFormSchema = z.object({
  title: z.string().trim().min(2, "A title is required.").max(160),
  category: z.string().min(1, "Select a category."),
  classification: z.enum(["Internal", "Confidential", "Public"]),
  description: z.string().trim().max(2000).optional(),
});

export type DocumentFormInput = z.infer<typeof documentFormSchema>;