"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FilePenLine,
  FileSignature,
  FileStack,
  Loader2,
  Plus,
  ScrollText,
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useAddContractAmendment,
  useContract,
  useCreateContractVersion,
  useSetContractStatus,
  useSignContract,
  useTerminateContract,
} from "../api/contract.queries";
import { formatCurrency } from "../utils";

const LIFECYCLE = ["Draft", "Review", "Approval", "Signing", "Active"];

export function ContractDetail({ id }: { id: string }) {
  const { data: contract, isPending, isError, refetch } = useContract(id);
  const setStatus = useSetContractStatus();
  const sign = useSignContract();
  const createVersion = useCreateContractVersion();
  const addAmendment = useAddContractAmendment();
  const terminate = useTerminateContract();
  const [versionSummary, setVersionSummary] = React.useState("");
  const [amendmentTitle, setAmendmentTitle] = React.useState("");
  const [amendmentNote, setAmendmentNote] = React.useState("");

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading contract…
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load contract</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/procurement/contracts"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to contracts
          </Link>
        </div>
      </div>
    );
  }

  const current = contract;
  const lifecycleIndex = LIFECYCLE.indexOf(current.status);

  const advance = async () => {
    const flow: Record<
      string,
      { status: "Review" | "Approval" | "Signing"; label: string }
    > = {
      Draft: { status: "Review", label: "Moved to review" },
      Review: { status: "Approval", label: "Submitted for approval" },
      Approval: { status: "Signing", label: "Ready for signing" },
      Signing: { status: "Signing", label: "Ready for signing" },
    };
    const next = flow[current.status];
    if (!next) return;
    try {
      await setStatus.mutateAsync({
        id: current.id,
        status: next.status as (typeof flow)[keyof typeof flow]["status"],
      });
      toast.success(next.label);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update.");
    }
  };

  const handleSign = async () => {
    try {
      await sign.mutateAsync(current.id);
      toast.success("Contract signed (CON-010)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign.");
    }
  };

  const handleVersion = async () => {
    try {
      await createVersion.mutateAsync({
        id: current.id,
        summary: versionSummary,
      });
      setVersionSummary("");
      toast.success("Version created (CON-011)");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to version."
      );
    }
  };

  const handleAmendment = async () => {
    if (!amendmentTitle.trim()) {
      toast.error("Title the amendment.");
      return;
    }
    try {
      await addAmendment.mutateAsync({
        id: current.id,
        title: amendmentTitle,
        note: amendmentNote,
      });
      setAmendmentTitle("");
      setAmendmentNote("");
      toast.success("Amendment recorded (CON-012)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add.");
    }
  };

  return (
    <div className="grid gap-6">
      <Link
        href="/procurement/contracts"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to contracts
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.title}
              </h2>
              <StatusBadge status={current.status} />
              {current.signed ? <Badge variant="outline">Signed</Badge> : null}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.ref} · {current.type} · {current.supplier}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant="outline">{formatCurrency(current.value)}</Badge>
              <Badge variant="secondary">Owner: {current.owner}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {current.status !== "Active" &&
            current.status !== "Expired" &&
            current.status !== "Terminated" &&
            current.status !== "Completed" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={advance}
                disabled={setStatus.isPending}
              >
                {setStatus.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ScrollText />
                )}
                Advance
              </Button>
            ) : null}
            {current.status === "Signing" || current.status === "Approval" ? (
              <Button size="sm" onClick={handleSign} disabled={sign.isPending}>
                {sign.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileSignature />
                )}
                Sign
              </Button>
            ) : null}
            {current.status === "Active" ? (
              <ConfirmDialog
                title="Terminate contract?"
                description={`${current.title} will be marked terminated (CON-014).`}
                confirmLabel="Terminate"
                onConfirm={() =>
                  terminate.mutateAsync(current.id).then(() => undefined)
                }
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    Terminate
                  </Button>
                }
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle */}
      <Card>
        <CardHeader>
          <CardTitle>Contract lifecycle</CardTitle>
          <CardDescription>
            Draft → Review → Approval → Signing → Active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {LIFECYCLE.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${
                    index <= lifecycleIndex
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {index < LIFECYCLE.length - 1 ? (
                  <span className="h-px w-4 bg-border" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileStack className="size-4 text-muted-foreground" />
                Versions (CON-011)
              </CardTitle>
              <CardDescription>
                Contract revisions are versioned and immutable.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ul className="divide-y">
                {(current.versions ?? []).map((version) => (
                  <li
                    key={version.id}
                    className="flex items-start gap-3 py-2.5"
                  >
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileStack className="size-3 text-muted-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        <span className="font-mono">{version.version}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {new Date(version.at).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {version.actor} — {version.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="Change note for new version…"
                  value={versionSummary}
                  onChange={(event) => setVersionSummary(event.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleVersion}
                  disabled={createVersion.isPending}
                >
                  <Plus />
                  Version
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePenLine className="size-4 text-muted-foreground" />
                Amendments (CON-012)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {(current.amendments ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No amendments recorded.
                </p>
              ) : (
                <ul className="divide-y">
                  {(current.amendments ?? []).map((amendment) => (
                    <li key={amendment.id} className="py-2.5 text-sm">
                      <p className="font-medium">{amendment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(amendment.at).toLocaleDateString()} —{" "}
                        {amendment.note}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="grid gap-2 rounded-lg border p-3">
                <Input
                  placeholder="Amendment title"
                  value={amendmentTitle}
                  onChange={(event) => setAmendmentTitle(event.target.value)}
                />
                <Input
                  placeholder="Note"
                  value={amendmentNote}
                  onChange={(event) => setAmendmentNote(event.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleAmendment}
                  disabled={addAmendment.isPending}
                  className="justify-self-end"
                >
                  <Plus />
                  Add amendment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Terms</CardTitle>
            <CardDescription>
              Contract value and validity (CON-005…008).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Value</dt>
                <dd className="font-mono tabular-nums">
                  {formatCurrency(current.value)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Start date</dt>
                <dd>{new Date(current.startDate).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">End date</dt>
                <dd className="font-medium">
                  {new Date(current.endDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Supplier</dt>
                <dd className="font-medium">{current.supplier}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Signed</dt>
                <dd>{current.signed ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
