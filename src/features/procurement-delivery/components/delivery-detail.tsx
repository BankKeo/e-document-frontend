"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Truck,
  TruckIcon,
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
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useConfirmDelivery,
  useDelivery,
  useMarkShipped,
  useReceiveDelivery,
} from "../api/delivery.queries";
import type { DeliveryLine } from "../types";

export function DeliveryDetail({ id }: { id: string }) {
  const { data: delivery, isPending, isError, refetch } = useDelivery(id);
  const markShipped = useMarkShipped();
  const receive = useReceiveDelivery();
  const confirm = useConfirmDelivery();
  const [received, setReceived] = React.useState<Record<string, number>>({});
  const [rejected, setRejected] = React.useState<Record<string, number>>({});

  // Reset receive inputs when the delivery changes.
  const lastId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!delivery) return;
    if (lastId.current === delivery.id) return;
    lastId.current = delivery.id;
    const nextReceived: Record<string, number> = {};
    const nextRejected: Record<string, number> = {};
    delivery.lines.forEach((line) => {
      nextReceived[line.id] = line.receivedQty;
      nextRejected[line.id] = line.rejectedQty;
    });
    setReceived(nextReceived);
    setRejected(nextRejected);
  }, [delivery]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading delivery…
      </div>
    );
  }

  if (isError || !delivery) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load delivery</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/procurement/deliveries"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to deliveries
          </Link>
        </div>
      </div>
    );
  }

  const current = delivery;

  async function handleShipped() {
    try {
      await markShipped.mutateAsync(current.id);
      toast.success("Shipment status updated (DEL-004)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  }

  async function handleReceive() {
    try {
      await receive.mutateAsync({ id: current.id, received, rejected });
      toast.success("Quantities recorded (DEL-006/007/008)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to record.");
    }
  }

  async function handleConfirm() {
    try {
      await confirm.mutateAsync(current.id);
      toast.success("Delivery confirmed (DEL-010)");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to confirm."
      );
    }
  }

  const canReceive =
    current.status === "Scheduled" ||
    current.status === "Shipped" ||
    current.status === "Partially Received";

  return (
    <div className="grid gap-6">
      <Link
        href="/procurement/deliveries"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to deliveries
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
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {current.note || "No note."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {current.status === "Scheduled" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShipped}
                disabled={markShipped.isPending}
              >
                {markShipped.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Truck />
                )}
                Mark shipped
              </Button>
            ) : null}
            {["Received", "Partially Received"].includes(current.status) ? (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={confirm.isPending}
              >
                {confirm.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 />
                )}
                Confirm quality
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery flow</CardTitle>
          <CardDescription>
            Purchase Order → Expected Delivery → Receiving (DEL-009).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {["Scheduled", "Shipped", "Received", "Confirmed"].map(
              (step, index) => {
                const reached =
                  step === "Confirmed"
                    ? current.status === "Confirmed"
                    : ["Partially Received", "Received"].includes(
                          current.status
                        )
                      ? index <= 2
                      : index === 0 ||
                        (current.status === "Shipped" && index <= 1);
                return (
                  <li key={step} className="flex items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${
                        reached
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                    {index < 3 ? (
                      <span className="h-px w-4 bg-border" aria-hidden />
                    ) : null}
                  </li>
                );
              }
            )}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items — expected vs received</CardTitle>
          <CardDescription>
            Record received and rejected quantities; partial delivery is allowed
            (DEL-005…008).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <ul className="divide-y">
            {current.lines.map((line) => (
              <LineRow
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
              <Button
                variant="outline"
                onClick={handleReceive}
                disabled={receive.isPending}
              >
                {receive.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <TruckIcon />
                )}
                Save receiving
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function LineRow({
  line,
  canReceive,
  received,
  rejected,
  setReceived,
  setRejected,
}: {
  line: DeliveryLine;
  canReceive: boolean;
  received: number;
  rejected: number;
  setReceived: (value: number) => void;
  setRejected: (value: number) => void;
}) {
  const receivedTotal = received + rejected;
  const remaining = Math.max(0, line.expectedQty - receivedTotal);
  return (
    <li className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <p className="text-sm font-medium">{line.item}</p>
        <p className="text-xs text-muted-foreground">
          Expected {line.expectedQty} {line.unit} · received {received} ·
          rejected {rejected} ·{" "}
          {remaining > 0 ? `${remaining} remaining` : "complete"}
        </p>
        {receivedTotal > line.expectedQty ? (
          <Badge variant="destructive" className="mt-1">
            Over-delivery
          </Badge>
        ) : null}
      </div>
      {canReceive ? (
        <div className="flex items-center gap-2">
          <label
            htmlFor={`recv-${line.id}`}
            className="text-xs text-muted-foreground"
          >
            Received
          </label>
          <Input
            id={`recv-${line.id}`}
            type="number"
            min={0}
            className="h-7 w-20"
            value={received}
            onChange={(event) => setReceived(Number(event.target.value) || 0)}
          />
          <label
            htmlFor={`rej-${line.id}`}
            className="text-xs text-muted-foreground"
          >
            Rejected
          </label>
          <Input
            id={`rej-${line.id}`}
            type="number"
            min={0}
            className="h-7 w-20"
            value={rejected}
            onChange={(event) => setRejected(Number(event.target.value) || 0)}
          />
        </div>
      ) : null}
    </li>
  );
}
