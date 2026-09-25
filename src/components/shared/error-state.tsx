"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border py-16 text-center">
      <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </div>
      <div className="grid gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className="mt-1"
          onClick={onRetry}
        >
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
