"use client";

import { UserForm } from "@/features/users/components/user-form";
import { UserTable } from "@/features/users/components/user-table";

export default function UsersView() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Example feature: React Hook Form + Zod validation and TanStack Query
          with cache invalidation.
        </p>
      </header>

      <div className="grid gap-8">
        <section aria-labelledby="create-user-heading">
          <h2 id="create-user-heading" className="mb-3 text-lg font-medium">
            Create a user
          </h2>
          <UserForm />
        </section>

        <section aria-labelledby="users-heading">
          <h2 id="users-heading" className="mb-3 text-lg font-medium">
            All users
          </h2>
          <UserTable />
        </section>
      </div>
    </main>
  );
}
