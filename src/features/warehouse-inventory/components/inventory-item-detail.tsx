"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRightLeft,
  Loader2,
  ScanBarcode,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useInventoryItem,
  useSetReserved,
  useSetItemStatus,
} from "../api/inventory.queries";
import type { StockMovement } from "../types";
import { lowStock } from "../utils";
import { AdjustStockDialog } from "./adjust-stock-dialog";

const MOVE_TONE: Record<
  StockMovement["type"],
  { badge: "default" | "secondary" | "outline" | "destructive"; sign: string }
> = {
  INBOUND: { badge: "default", sign: "+" },
  OUTBOUND: { badge: "secondary", sign: "−" },
  TRANSFER: { badge: "outline", sign: "⇄" },
  ADJUSTMENT: { badge: "destructive", sign: "±" },
};

export function InventoryItemDetail({ id }: { id: string }) {
  const { data: item, isPending, isError, refetch } = useInventoryItem(id);
  const setReserved = useSetReserved();
  const setItemStatus = useSetItemStatus();
  const [adjustOpen, setAdjustOpen] = React.useState(false);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading item…
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load item</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/warehouse/inventory"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to inventory
          </Link>
        </div>
      </div>
    );
  }

  const current = item;
  const available = current.currentStock - current.reservedStock;

  async function toggleReserve() {
    try {
      const next =
        current.reservedStock > 0
          ? 0
          : Math.min(current.currentStock, Math.max(0, 1));
      await setReserved.mutateAsync({ id: current.id, reservedStock: next });
      toast.success(
        next > 0
          ? "Reserved 1 unit (STOCK-005)"
          : "Reservation released (STOCK-006)"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/warehouse/inventory"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to inventory
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.name}
              </h2>
              <Badge
                variant={
                  current.itemStatus === "Active"
                    ? "default"
                    : current.itemStatus === "Inactive"
                      ? "secondary"
                      : "destructive"
                }
              >
                {current.itemStatus}
              </Badge>
              {lowStock(current) ? (
                <Badge variant="destructive">Low stock</Badge>
              ) : null}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.sku} · {current.barcode}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="outline">{current.category}</Badge>
              {current.brand ? (
                <Badge variant="secondary">{current.brand}</Badge>
              ) : null}
              {current.model ? (
                <Badge variant="secondary">{current.model}</Badge>
              ) : null}
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {current.location}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleReserve}
              disabled={setReserved.isPending || current.currentStock === 0}
            >
              {current.reservedStock > 0 ? "Release" : "Reserve"}
            </Button>
            <Button
              size="sm"
              onClick={() => setAdjustOpen(true)}
              disabled={setItemStatus.isPending}
            >
              <SlidersHorizontal />
              Adjust stock
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stock position</CardTitle>
            <CardDescription>
              On hand, reserved, available, and thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">On hand</dt>
                <dd className="font-mono text-lg font-semibold">
                  {current.currentStock}{" "}
                  <span className="text-xs text-muted-foreground">
                    {current.unit}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Reserved (STOCK-005)</dt>
                <dd className="font-mono tabular-nums">
                  {current.reservedStock}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Available</dt>
                <dd className="font-mono tabular-nums">{available}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Min / Max stock</dt>
                <dd className="font-mono tabular-nums">
                  {current.minStock} / {current.maxStock}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Reorder point (FORECAST-004)
                </dt>
                <dd className="font-mono tabular-nums">
                  {current.reorderPoint}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="size-4 text-muted-foreground" />
              Traceability (STOCK-002)
            </CardTitle>
            <CardDescription>
              Every inventory movement is recorded: INBOUND +, TRANSFER,
              OUTBOUND −, ADJUSTMENT.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {current.movements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No movements yet.</p>
            ) : (
              <ol className="grid gap-2">
                {current.movements.map((movement) => {
                  const meta = MOVE_TONE[movement.type];
                  return (
                    <li
                      key={movement.id}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
                    >
                      <Badge variant={meta.badge}>{meta.sign}</Badge>
                      <span className="min-w-0 flex-1">
                        <span className="font-medium">{movement.type}</span>
                        <span className="ml-2 font-mono text-xs text-muted-foreground">
                          {movement.reference}
                        </span>
                      </span>
                      <span className="font-mono text-xs tabular-nums">
                        {movement.quantity > 0
                          ? `+${movement.quantity}`
                          : movement.quantity}{" "}
                        {current.unit}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(movement.at).toLocaleDateString()}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanBarcode className="size-4 text-muted-foreground" />
            Product master attributes (ITEM-001…012)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="font-mono">{current.sku}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Barcode</dt>
              <dd className="font-mono">{current.barcode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Category</dt>
              <dd>{current.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Unit of measure</dt>
              <dd>{current.unit}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {adjustOpen ? (
        <AdjustStockDialog
          key="adjust"
          item={current}
          onOpenChange={(open) => {
            if (!open) setAdjustOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
