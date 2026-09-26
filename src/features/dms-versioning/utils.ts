import type { DiffLine } from "./types";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Extremely small line diff: split into lines, then mark equal / added / removed.
// Good enough for the mock UX; swap for a proper diff engine when wiring the API.
export function diffLines(left: string, right: string): DiffLine[] {
  const a = left.split("\n");
  const b = right.split("\n");
  const rows: DiffLine[] = [];

  // Greedy line-alignment by rolling longest-common-subsequence over small inputs.
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      rows.push({ kind: "same", left: a[i], right: b[j] });
      i++;
      j++;
    } else if (
      j < b.length &&
      (i === a.length || dp[i][j + 1] >= dp[i + 1][j])
    ) {
      rows.push({ kind: "added", right: b[j] });
      j++;
    } else {
      rows.push({ kind: "removed", left: a[i] });
      i++;
    }
  }

  return rows;
}
