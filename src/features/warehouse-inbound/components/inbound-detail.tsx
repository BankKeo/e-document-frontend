"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  PackagePlus,
  ScanBarcode,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useInboundOrder,
  useMarkArrived,
  usePutAway,
  useReceiveGoods,
} from "../api/inbound.queries";
import type { InboundLine } from "../types";

const FLOW = ["Scheduled", "Arrived", "Inspected", "Put-away", "Received"];

export function InboundDetail({ id }: { id: string }) {
  const { data: order, isPending, isError, refetch } = useInboundOrder(id);
  const markArrived = useMarkArrived();
  const receive = useReceiveGoods();
  const putAway = usePutAway();
  const [received, setReceived] = React.useState<Record<string, number>>({});
  const [rejected, setRejected] = React.useState<Record<string, number>>({});

  const lastId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!order) return;
    if (lastId.current === order.id) return;
    lastId.current = order.id;
    const nextReceived: Record<string, number> = {};
    const nextRejected: Record<string, number> = {};
    order.lines.forEach((line) => {
      nextReceived[line.id] = line.received;
      nextRejected[line.id] = line.rejected;
    });
    setReceived(nextReceived);
    setRejected(nextRejected);
  }, [order]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading receiving order…
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load receiving order</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/warehouse/inbound"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to inbound
          </Link>
        </div>
      </div>
    );
  }

  const current = order;
  const canReceive = ["Arrived", "Inspected"].includes(current.status);
  const flowIndex = FLOW.indexOf(current.status);

  async function handleArrived() {
    try {
      await markArrived.mutateAsync(current.id);
      toast.success("Arrival confirmed (IN-002)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  async function handleReceive() {
    try {
      await receive.mutateAsync({ id: current.id, received, rejected });
      toast.success("Goods received & verified (IN-003/005)");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to receive."
      );
    }
  }

  async function handlePutAway() {
    try {
      await putAway.mutateAsync(current.id);
      toast.success("Put-away completed — inventory updated (IN-009)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/warehouse/inbound"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to inbound
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.ref}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.purchaseOrderRef} · {current.supplier}
            </p>
            <p className="text-sm text-muted-foreground">
              {current.warehouse} · {current.note || "No note."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {current.status === "Scheduled" ? (
              <Button
                size="sm"
                onClick={handleArrived}
                disabled={markArrived.isPending}
              >
                {markArrived.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Truck />
                )}
                Confirm arrival
              </Button>
            ) : null}
            {current.status === "Put-away" ? (
              <Button
                size="sm"
                onClick={handlePutAway}
                disabled={putAway.isPending}
              >
                {putAway.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PackagePlus />
                )}
                Complete put-away
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Receiving flow</CardTitle>
          <CardDescription>
            Purchase order → Arrival → Inspection → Put-away → Inventory
            updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {FLOW.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${
                    index <= flowIndex
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {index < FLOW.length - 1 ? (
                  <span className="h-px w-4 bg-border" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items to receive</CardTitle>
          <CardDescription>
            Barcode scan & quantity verification (IN-004/005).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <ul>
            {current.lines.map((line) => (
              <InboundLineRow
                key={line.id}
                line={line}
                canReceive={canReceive}
                received={received[line.id] ?? 0}
                rejected={rejected[line.id] ?? 0}
                setReceived={(value) =>
                  setReceived((prev) => ({ ...prev, [line.id]: value }))
                }
                setRejected={(value) =>
                  setRejected((prev) => ({ ...prev, [line.id]: value }))
                }
              />
            ))}
          </ul>
          {canReceive ? (
            <div className="flex justify-end gap-2 border-t pt-3">
              <Button onClick={handleReceive} disabled={receive.isPending}>
                {receive.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ScanBarcode />
                )}
                Receive goods
              </Button>
            </div>
          ) : null}
          {current.status === "Arrived" ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ScanBarcode className="size-3.5" />
              After verifying, mark inspected via quality check before put-away.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InboundLineRow({
  line,
  canReceive,
  received,
  rejected,
  setReceived,
  setRejected,
}: {
  line: InboundLine;
  canReceive: boolean;
  received: number;
  rejected: number;
  setReceived: (value: number) => void;
  setRejected: (value: number) => void;
}) {
  return (
    <li className="grid gap-3 border-b py-3 sm:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <p className="text-sm font-medium">{line.itemName}</p>
        <p className="font-mono text-xs text-muted-foreground">{line.sku}</p>
        <p className="text-xs text-muted-foreground">
          Expected {line.expected} {line.unit} · received {received} · rejected{" "}
          {rejected}
        </p>
      </div>
      {canReceive ? (
        <div className="flex items-center gap-2">
          <label
            htmlFor={`in-recv-${line.id}`}
            className="text-xs text-muted-foreground"
          >
            Received
          </label>
          <input
            id={`in-recv-${line.id}`}
            type="number"
            min={0}
            className="h-7 w-20 rounded-md border bg-background px-2 text-sm"
            value={received}
            onChange={(event) => setReceived(Number(event.target.value) || 0)}
          />
          <label
            htmlFor={`in-rej-${line.id}`}
            className="text-xs text-muted-foreground"
          >
            Damaged
          </label>
          <input
            id={`in-rej-${line.id}`}
            type="number"
            min={0}
            className="h-7 w-20 rounded-md border bg-background px-2 text-sm"
            value={rejected}
            onChange={(event) => setRejected(Number(event.target.value) || 0)}
          />
        </div>
      ) : null}
    </li>
  );
}
