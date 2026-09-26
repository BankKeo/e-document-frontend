"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  FileText,
  Gavel,
  Loader2,
  Paperclip,
  Rocket,
  Users,
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
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAwardTender,
  usePublishTender,
  useTender,
} from "../api/tender.queries";
import type { TenderBid } from "../types";
import { formatCurrency } from "../utils";
import { ScoreBidDialog } from "./score-bid-dialog";
import { SubmitBidDialog } from "./submit-bid-dialog";

export function TenderDetail({ id }: { id: string }) {
  const { data: tender, isPending, isError, refetch } = useTender(id);
  const publish = usePublishTender();
  const award = useAwardTender();
  const [scoring, setScoring] = React.useState<TenderBid | null>(null);
  const [submitOpen, setSubmitOpen] = React.useState(false);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading tender…
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load tender</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/procurement/tenders"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to tenders
          </Link>
        </div>
      </div>
    );
  }

  const current = tender;

  return (
    <div className="grid gap-6">
      <Link
        href="/procurement/tenders"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to tenders
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {current.title}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {current.ref} · {current.category}
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {current.description}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">
                Est. {formatCurrency(current.estimatedValue)}
              </Badge>
              <Badge variant="secondary">Owner: {current.owner}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {current.status === "Draft" ? (
              <Button
                size="sm"
                onClick={() => void publish.mutateAsync(current.id)}
                disabled={publish.isPending}
              >
                {publish.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Rocket />
                )}
                Publish (TENDER-006)
              </Button>
            ) : null}
            {current.status === "Open for Bids" ? (
              <Button size="sm" onClick={() => setSubmitOpen(true)}>
                <Gavel /> Submit bid
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              Schedule (TENDER-005)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Publish</dt>
                <dd>
                  {new Date(current.schedule.publish).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Bid submission deadline
                </dt>
                <dd className="font-medium">
                  {new Date(
                    current.schedule.bidSubmission
                  ).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Bid opening</dt>
                <dd>
                  {new Date(current.schedule.bidOpening).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Evaluation</dt>
                <dd>
                  {new Date(current.schedule.evaluation).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Award</dt>
                <dd>{new Date(current.schedule.award).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="size-4 text-muted-foreground" />
                Documents (TENDER-004)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {current.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents yet.
                </p>
              ) : (
                <ul className="grid gap-1.5">
                  {current.documents.map((document) => (
                    <li
                      key={document.id}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <FileText className="size-3.5" />
                      <span className="font-mono text-xs">{document.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {document.type}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                Evaluation committee (TENDER-015)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {current.evaluationCommittee.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Committee not yet assigned.
                </p>
              ) : (
                <ul className="grid gap-1.5">
                  {current.evaluationCommittee.map((member) => (
                    <li key={member} className="text-sm text-muted-foreground">
                      {member}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bids table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="size-4 text-muted-foreground" />
            Bids (TENDER-009/010)
          </CardTitle>
          <CardDescription>
            Submitted bids with evaluation scores (TENDER-012/013/014) and award
            actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {current.bids.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No bids submitted yet.
            </p>
          ) : (
            <ul className="divide-y">
              {current.bids.map((bid) => (
                <li
                  key={bid.id}
                  className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {bid.supplier}
                      {bid.totalScore ? (
                        <Badge variant="outline" className="font-mono">
                          {bid.totalScore}
                        </Badge>
                      ) : null}
                      <Badge variant="secondary">{bid.status}</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bid.amount > 0
                        ? `Bid ${formatCurrency(bid.amount)}`
                        : "No financial offer"}{" "}
                      · {new Date(bid.submittedAt).toLocaleDateString()}
                      {bid.technicalScore !== undefined
                        ? ` · Technical ${bid.technicalScore} / Financial ${bid.financialScore}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {current.status === "Bids Closed" ||
                    current.status === "Under Evaluation" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setScoring(bid)}
                      >
                        <Gavel /> Score
                      </Button>
                    ) : null}
                    {current.status === "Award Recommendation" &&
                    bid.status === "Shortlisted" ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          void award
                            .mutateAsync({ id: current.id, bidId: bid.id })
                            .then(() => toast.success("Tender awarded"))
                        }
                        disabled={award.isPending}
                      >
                        <Award /> Award
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {scoring ? (
        <ScoreBidDialog
          key={scoring.id}
          tenderId={current.id}
          bid={scoring}
          onOpenChange={(open) => {
            if (!open) setScoring(null);
          }}
        />
      ) : null}

      {submitOpen ? (
        <SubmitBidDialog
          tenderId={current.id}
          onOpenChange={(open) => {
            if (!open) setSubmitOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
