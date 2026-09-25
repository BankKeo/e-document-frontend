import { z } from "zod";

const role = z.string().min(1, "Select a role.");
const department = z.string().min(1, "Select a department.");

export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  title: z
    .string()
    .trim()
    .max(100, "Title must be at most 100 characters.")
    .optional(),
  role,
  department,
});

export type UserFormInput = z.infer<typeof userFormSchema>;

export const createUserSchema = userFormSchema.extend({
  email: z.string().trim().email("Enter a valid email address."),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const editUserSchema = userFormSchema;

export type EditUserInput = z.infer<typeof editUserSchema>;