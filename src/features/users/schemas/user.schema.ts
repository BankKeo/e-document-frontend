import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  email: z.string().email("Enter a valid email address."),
  role: z.string().min(1, "Role is required."),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
