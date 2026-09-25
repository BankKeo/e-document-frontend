"use client";

import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Critical error
          </h1>
          <p className="text-muted-foreground">
            The application failed to load.
          </p>
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "outline" })}
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
