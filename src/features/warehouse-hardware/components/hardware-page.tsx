"use client";

import * as React from "react";
import {
  CheckCircle2,
  Loader2,
  Power,
  Printer,
  QrCode,
  ScanBarcode,
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
  useGenerateLabel,
  useGeneratedLabels,
  useHardwareDevices,
  usePrintLabel,
  useToggleDevice,
} from "../api/hardware.queries";

const STATUS_TONE: Record<
  string,
  "default" | "outline" | "destructive" | "secondary"
> = {
  Connected: "default",
  Offline: "secondary",
  Unavailable: "destructive",
};

export function HardwarePage() {
  const { data: devices, isError, refetch } = useHardwareDevices();
  const { data: labels } = useGeneratedLabels();
  const generate = useGenerateLabel();
  const print = usePrintLabel();
  const toggle = useToggleDevice();
  const [type, setType] = React.useState<"Barcode" | "QR">("Barcode");
  const [target, setTarget] = React.useState("");
  const [code, setCode] = React.useState("");

  async function handleGenerate() {
    if (!target.trim() || !code.trim()) {
      toast.error("Enter both a target and a code.");
      return;
    }
    try {
      await generate.mutateAsync({
        type,
        target: target.trim(),
        code: code.trim(),
      });
      toast.success(`${type} generated (HW-001/003)`);
      setTarget("");
      setCode("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to generate."
      );
    }
  }

  async function handlePrint() {
    try {
      await print.mutateAsync();
      toast.success("Sent to printer (HW-009/010)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to print.");
    }
  }

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load hardware.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="justify-self-start text-sm text-primary underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanBarcode className="size-4 text-muted-foreground" />
            Devices (HW-002…008)
          </CardTitle>
          <CardDescription>
            Scanners, printers, and mobile scanning endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {(devices ?? []).map((device) => (
              <li
                key={device.id}
                className="flex flex-wrap items-center gap-3 py-2.5 text-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {device.type === "Barcode Scanner" ? (
                    <ScanBarcode className="size-4" />
                  ) : (
                    <Printer className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.location}
                  </p>
                </div>
                <Badge variant={STATUS_TONE[device.status]}>
                  {device.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void toggle.mutateAsync(device.id)}
                  disabled={toggle.isPending || device.status === "Unavailable"}
                >
                  {toggle.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Power />
                  )}
                  Toggle
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="size-4 text-muted-foreground" />
              Generate label (HW-001/003/009)
            </CardTitle>
            <CardDescription>
              Create a barcode or QR label for an item or asset.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex gap-2">
              <Button
                variant={type === "Barcode" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("Barcode")}
              >
                <ScanBarcode className="size-4" /> Barcode
              </Button>
              <Button
                variant={type === "QR" ? "default" : "outline"}
                size="sm"
                onClick={() => setType("QR")}
              >
                <QrCode className="size-4" /> QR
              </Button>
            </div>
            <input
              aria-label="Target"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              placeholder="Target (e.g. SKU-001 — Paper A4)"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
            <input
              aria-label="Code"
              className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm"
              placeholder={
                type === "Barcode"
                  ? "8851234567890"
                  : "https://edemo.local/item/SKU-001"
              }
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <Button
              onClick={handleGenerate}
              disabled={generate.isPending}
              className="justify-self-end"
            >
              {generate.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <QrCode />
              )}
              Generate
            </Button>
          </CardContent>
        </Card>

        {/* Labels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanBarcode className="size-4 text-muted-foreground" />
              Recently generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(labels ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No labels generated yet.
              </p>
            ) : (
              <ul className="divide-y">
                {(labels ?? []).map((label) => (
                  <li
                    key={label.id}
                    className="flex flex-wrap items-center gap-3 py-2.5 text-sm"
                  >
                    <Badge variant="outline">{label.type}</Badge>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-mono text-xs">{label.code}</span>
                      <span className="ml-2 text-muted-foreground">
                        {label.target}
                      </span>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      disabled={print.isPending}
                    >
                      {print.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Printer />
                      )}
                      Print
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scan flows */}
      <Card>
        <CardHeader>
          <CardTitle>Scan workflows supported</CardTitle>
          <CardDescription>
            Where barcoding is applied across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              "Receiving scan (IN-004 / HW-005)",
              "Picking scan (OUT-006 / HW-006)",
              "Stock count scan (STOCK-007 / HW-007)",
              "Asset scan (ASSET-002 / HW-008)",
              "Label printing (HW-009)",
              "Printer integration (HW-010)",
            ].map((line) => (
              <li
                key={line}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {line}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
