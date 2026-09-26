"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Car, Loader2, UserRound, Wrench } from "lucide-react";
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
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAsset,
  useAssignAsset,
  useDisposeAsset,
  useRecordMaintenance,
} from "../api/asset.queries";
import { formatCurrency } from "../utils";

const CUSTODIANS = [
  "Aloun Sisavath",
  "Kham Anoulack",
  "Malina Phetxomphou",
  "Malinee Vongkham",
  "Somchai Keopaseuth",
];

export function AssetDetail({ id }: { id: string }) {
  const { data: asset, isPending, isError, refetch } = useAsset(id);
  const assign = useAssignAsset();
  const maintenance = useRecordMaintenance();
  const dispose = useDisposeAsset();
  const [custodian, setCustodian] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [note, setNote] = React.useState("");

  // Reset inputs when the asset changes.
  const lastId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!asset) return;
    if (lastId.current === asset.id) return;
    lastId.current = asset.id;
    setCustodian("");
    setLocation(asset.location);
    setNote("");
  }, [asset]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading asset…
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load asset</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/warehouse/assets"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to assets
          </Link>
        </div>
      </div>
    );
  }

  const current = asset;

  async function handleAssign() {
    if (!custodian.trim()) {
      toast.error("Choose a custodian.");
      return;
    }
    try {
      await assign.mutateAsync({ id: current.id, custodian, location });
      toast.success("Asset assigned (ASSET-006)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to assign.");
    }
  }

  async function handleMaintenance() {
    try {
      await maintenance.mutateAsync({
        id: current.id,
        note: note || "Routine maintenance",
      });
      setNote("");
      toast.success("Maintenance recorded (ASSET-008)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to record.");
    }
  }

  async function handleDispose() {
    try {
      await dispose.mutateAsync(current.id);
      toast.success("Asset disposed (ASSET-011)");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to dispose."
      );
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/warehouse/assets"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to assets
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.name}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.tag} · {current.category}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="outline">{current.location}</Badge>
              <Badge variant="secondary">Custodian: {current.custodian}</Badge>
            </div>
          </div>
          {current.status !== "Disposed" ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMaintenance}
                disabled={maintenance.isPending}
              >
                {maintenance.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wrench />
                )}
                Maintenance
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={handleDispose}
                disabled={dispose.isPending}
              >
                Dispose
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financials</CardTitle>
            <CardDescription>
              Purchase value and depreciation (ASSET-010).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Purchase value</dt>
                <dd className="font-mono tabular-nums">
                  {formatCurrency(current.purchaseValue)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Current book value</dt>
                <dd className="font-mono font-semibold tabular-nums">
                  {formatCurrency(current.currentValue)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Depreciation rate</dt>
                <dd className="font-mono tabular-nums">
                  {current.depreciationRate}% / yr
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Purchased</dt>
                <dd>{new Date(current.purchaseDate).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-4 text-muted-foreground" />
                Assignment & transfer (ASSET-006/007)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <select
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                value={custodian}
                onChange={(event) => setCustodian(event.target.value)}
              >
                <option value="">Select custodian…</option>
                {CUSTODIANS.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
              <input
                aria-label="Location"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="New location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAssign}
                disabled={assign.isPending || !custodian}
              >
                {assign.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Car />
                )}
                Assign
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="size-4 text-muted-foreground" />
                Maintenance history (ASSET-008/009)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {!current.maintenance || current.maintenance.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No maintenance recorded.
                </p>
              ) : (
                <ul className="divide-y">
                  {current.maintenance.map((entry, index) => (
                    <li key={`${entry.last}-${index}`} className="py-2 text-sm">
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.last).toLocaleDateString()}
                      </p>
                      <p className="font-medium">{entry.note}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input
                  aria-label="Maintenance note"
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="Maintenance note…"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => void handleMaintenance()}
                  disabled={maintenance.isPending}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {current.history && current.history.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Asset history (ASSET-012)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative grid gap-4 border-l pl-4">
              {current.history.map((entry, index) => (
                <li key={`${entry.at}-${index}`} className="relative">
                  <span className="absolute top-1.5 -left-[21px] size-1.5 rounded-full bg-foreground/30" />
                  <p className="text-sm">{entry.event}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.actor} · {new Date(entry.at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
