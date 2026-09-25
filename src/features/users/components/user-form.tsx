"use client";

import { AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateUser } from "@/features/users/api/user.queries";
import {
  createUserSchema,
  type CreateUserInput,
} from "@/features/users/schemas/user.schema";
import { normalizeErrorMessage } from "@/lib/api/errors";

export function UserForm() {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  function onSubmit(input: CreateUserInput) {
    createUser.mutate(input, {
      onSuccess: () => reset(),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      {createUser.isError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed to create user</AlertTitle>
          <AlertDescription>
            {normalizeErrorMessage(createUser.error)}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Jane Doe"
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="jane@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <Input
          id="role"
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? "role-error" : undefined}
          placeholder="Editor"
          {...register("role")}
        />
        {errors.role && (
          <p id="role-error" className="text-sm text-destructive">
            {errors.role.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create user"}
      </Button>
    </form>
  );
}
