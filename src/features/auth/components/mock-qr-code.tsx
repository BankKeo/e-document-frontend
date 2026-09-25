import { useMemo } from "react";

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 21;
const FINDER = 7;
const RANDOM_WEIGHT = 0.46;

function drawFinder(
  modules: boolean[][],
  row: number,
  col: number
): boolean[][] {
  const next = modules.map((line) => [...line]);
  for (let r = -1; r <= FINDER; r += 1) {
    for (let c = -1; c <= FINDER; c += 1) {
      const targetRow = row + r;
      const targetCol = col + c;
      if (targetRow < 0 || targetRow >= SIZE || targetCol < 0 || targetCol >= SIZE) {
        continue;
      }
      const ring = Math.max(Math.abs(r) - 1, Math.abs(c) - 1) >= FINDER - 3;
      next[targetRow][targetCol] = ring;
    }
  }
  return next;
}

export function generateQrModuleMap(seed: string): boolean[][] {
  const random = mulberry32(hashSeed(seed));
  let modules = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => random() < RANDOM_WEIGHT)
  );

  modules = drawFinder(modules, 0, 0);
  modules = drawFinder(modules, 0, SIZE - FINDER);
  modules = drawFinder(modules, SIZE - FINDER, 0);

  return modules;
}

export function MockQrCode({ value, size = 128 }: { value: string; size?: number }) {
  const modules = useMemo(() => generateQrModuleMap(value), [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label="Mock QR code placeholder"
      className="rounded-md border bg-white p-1.5"
    >
      <rect width={SIZE} height={SIZE} fill="#ffffff" />
      {modules.map((line, row) =>
        line.map((filled, col) =>
          filled ? (
            <rect
              key={`${row}-${col}`}
              x={col}
              y={row}
              width={1}
              height={1}
              fill="#0a0a0a"
            />
          ) : null
        )
      )}
      {/* render hint that this is a placeholder */}
      <text
        x={SIZE / 2}
        y={SIZE - 1.5}
        textAnchor="middle"
        fontSize={2.2}
        fill="#71717a"
        style={{ userSelect: "none" }}
      >
        MOCK
      </text>
    </svg>
  );
}