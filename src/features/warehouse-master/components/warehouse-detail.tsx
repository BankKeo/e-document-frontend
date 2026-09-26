"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWarehouse } from "../api/warehouse.queries";
import { capacityLabel } from "../utils";

export function WarehouseDetail({ id }: { id: string }) {
  const { data: warehouse, isPending, isError, refetch } = useWarehouse(id);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading warehouse…
      </div>
    );
  }

  if (isError || !warehouse) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load warehouse</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/warehouse/warehouses"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to warehouses
          </Link>
        </div>
      </div>
    );
  }

  const current = warehouse;
  const utilization = current.capacity
    ? Math.round((current.used / current.capacity) * 100)
    : 0;

  return (
    <div className="grid gap-6">
      <Link
        href="/warehouse/warehouses"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to warehouses
      </Link>

      <Card>
        <CardContent className="grid gap-4 sm:flex sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.name}
              </h2>
              <span className="rounded-md border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {current.code}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{current.location}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" />
              {current.staff} staff
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-sm tabular-nums">
                {capacityLabel(current.used)} /{" "}
                {capacityLabel(current.capacity)}
              </p>
              <div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location hierarchy</CardTitle>
          <CardDescription>
            Warehouse → Zone → Rack → Shelf (WH-003…006).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {current.zones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No zones defined yet.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {current.zones.map((zoneEntry) => (
                <div key={zoneEntry.id} className="rounded-lg border p-4">
                  <p className="text-sm font-medium">
                    {zoneEntry.name}
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      {zoneEntry.code}
                    </span>
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {zoneEntry.racks.map((rack) => (
                      <li key={rack.id} className="rounded-lg bg-muted/50 p-3">
                        <p className="font-mono text-xs text-muted-foreground">
                          {rack.code}
                        </p>
                        <ul className="mt-2 grid grid-cols-2 gap-1.5">
                          {rack.shelves.map((shelf) => (
                            <li
                              key={shelf.id}
                              className="rounded-md border bg-card px-2 py-1 font-mono text-xs text-muted-foreground"
                            >
                              {shelf.code}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
