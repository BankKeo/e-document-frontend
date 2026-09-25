import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters.")
    .max(60, "Role name must be at most 60 characters."),
  code: z
    .string()
    .trim()
    .min(2, "Code is required.")
    .max(20, "Code must be at most 20 characters."),
  description: z.string().trim().max(200).optional(),
});

export type RoleInput = z.infer<typeof roleSchema>;