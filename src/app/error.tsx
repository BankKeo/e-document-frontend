"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">An unexpected error has occurred.</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ variant: "default" })}
        >
          Try Again
        </button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go Home
        </Link>
      </div>
    </main>
  );
}
