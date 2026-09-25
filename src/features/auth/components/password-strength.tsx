"use client";

import { cn } from "@/lib/utils";
import type { PasswordStrength } from "../types";

const BAR_COLORS: Record<number, string> = {
  0: "bg-muted-foreground/30",
  1: "bg-destructive",
  2: "bg-destructive/70",
  3: "bg-amber-500",
  4: "bg-emerald-500",
};

export function PasswordStrengthMeter({ strength }: { strength: PasswordStrength }) {
  if (strength.score === 0 && strength.checks.every((check) => !check.met)) {
    return null;
  }

  return (
    <div className="grid gap-1.5">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              index <= strength.score
                ? BAR_COLORS[strength.score]
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Password strength:{" "}
          <span className="font-medium text-foreground">{strength.label}</span>
        </p>
      </div>
      <ul className="grid gap-1">
        {strength.checks.map((check) => (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              check.met ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full",
                check.met ? "bg-emerald-500/15" : "bg-muted"
              )}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 12 12"
                className="size-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2.5 6.5 5 9l4.5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}