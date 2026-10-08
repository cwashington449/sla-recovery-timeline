"use client";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Filter,
  Hourglass,
  ListOrdered,
  Megaphone,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { ToneBadge } from "@/components/tone";
import { TriageExamples } from "@/components/triage-examples";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { HIRING_STAGES, PLAN_STEPS, STOPS, metricsFor, outcomeLine, type Stop } from "@/lib/stops";
import { cn } from "@/lib/utils";

interface StopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stopIndex: number;
  onNavigate: (index: number) => void;
}

export function StopDialog({ open, onOpenChange, stopIndex, onNavigate }: StopDialogProps) {
  const stop = STOPS[stopIndex];
  const m = metricsFor(stop);
  const prev = stopIndex > 0 ? metricsFor(STOPS[stopIndex - 1]) : null;
  const isFirst = stopIndex === 0;
  const isLast = stopIndex === STOPS.length - 1;
  const [showDetails, setShowDetails] = useState(false);
  const [showTriage, setShowTriage] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setShowDetails(false);
          setShowTriage(false);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-5 pt-5 pb-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <Badge variant="outline" className="font-mono text-[11px]">
              Stop {stopIndex + 1} of {STOPS.length}
            </Badge>
            <span className="text-xs text-muted-foreground">{stop.period}</span>
            <ToneBadge tone={stop.tone} />
          </div>
          <DialogTitle className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{stop.title}</DialogTitle>
          <DialogDescription className="max-w-3xl text-sm leading-relaxed">{stop.summary}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ListOrdered className="size-4 text-muted-foreground" />
              This period in the plan
            </h3>
            <ol className="space-y-3">
              {stop.stepActions.map((sa) => {
                const meta = PLAN_STEPS.find((p) => p.id === sa.step);
                return (
                  <li key={sa.step} className="rounded-xl border bg-card px-4 py-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-primary tabular-nums">{sa.step}</span>
                      <span className="text-sm font-semibold">{meta?.title}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{sa.action}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <p className="rounded-xl border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground">
            {outcomeLine(stop, m, prev)}
          </p>

          <section className="rounded-xl border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Hourglass className="size-4 text-muted-foreground" />
              What waits
            </h3>
            <Bullets items={stop.waits} muted />
          </section>

          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Megaphone className="size-4" />
              What we need from leadership
            </div>
            <Bullets items={stop.leadershipAsks} />
          </div>

          <section className="rounded-xl border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="size-4 text-muted-foreground" />
              We&apos;ll know it&apos;s working when
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {stop.successChecks.slice(0, 3).map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </section>

          <div className="rounded-xl border">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold"
            >
              <span>More detail</span>
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", showDetails && "rotate-180")} />
            </button>
            {showDetails && (
              <div className="space-y-4 border-t px-4 py-4">
                <Section icon={<Users className="size-4" />} title="Who is on the team">
                  <Roster stop={stop} />
                  <p className="mt-2 text-xs text-muted-foreground">{stop.roster.note}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Effective capacity about{" "}
                    <span className="font-medium text-foreground">{m.effectiveFte.toFixed(1)} FTE</span> (1 FTE ≈ 11.6
                    tickets per week). Finishes about {m.capacity.toFixed(0)} per week vs arrivals about{" "}
                    {m.demand.toFixed(0)} ({m.opens.toFixed(0)} new + {m.reopens.toFixed(0)} coming back after close).
                  </p>
                </Section>

                <Section icon={<Briefcase className="size-4" />} title="Hiring and ramp-up">
                  <HiringStepper stage={stop.hiring.stage} />
                  <p className="mt-3 text-sm font-medium">{stop.hiring.headline}</p>
                  <p className="text-xs text-muted-foreground">{stop.hiring.detail}</p>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">
                        New-hire productivity
                        {m.hireRampWeek > 0 ? ` · ramp week ${m.hireRampWeek} of 13` : " · not started"}
                      </span>
                      <span className="font-mono font-medium tabular-nums">{m.hireRampPct}%</span>
                    </div>
                    <Progress value={m.hireRampPct} />
                  </div>
                </Section>

                <Section icon={<CircleDollarSign className="size-4" />} title="Partners with fees tied to SLA">
                  <p className="text-sm font-medium">{stop.fee.headline}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stop.fee.detail}</p>
                </Section>

                <Section icon={<CheckCircle2 className="size-4" />} title="Milestones">
                  <Bullets items={stop.milestones} />
                </Section>

                {stop.watch.length > 0 && (
                  <Section icon={<Hourglass className="size-4" />} title="Watch for">
                    <Bullets items={stop.watch} muted />
                  </Section>
                )}

                <details className="rounded-lg border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                  <summary className="cursor-pointer font-medium text-foreground">About these numbers</summary>
                  <p className="mt-2 leading-relaxed">
                    Facts come from the data pack. Projections use weekly flow: backlog change equals new opens plus
                    tickets that come back after close, minus finishes. After today, SLA is estimated from backlog size
                    using the History trend (about 100 backlog ≈ 93%, 200 ≈ 71%). Ticket sizes S / M / L / XL are 1 / 3 /
                    8 / 16 hours.
                  </p>
                </details>

                {stop.mentionsTriage && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowTriage((v) => !v)}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <Filter className="size-3.5" />
                      {showTriage ? "Hide intake triage examples" : "See intake triage examples from the queue"}
                    </button>
                    {showTriage && (
                      <div className="mt-3 [&_h2]:text-base [&_section]:mt-0">
                        <TriageExamples />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t bg-muted/40 px-5 py-3 sm:px-6">
          <Button variant="outline" size="sm" disabled={isFirst} onClick={() => onNavigate(stopIndex - 1)}>
            <ArrowLeft /> {isFirst ? "Start" : STOPS[stopIndex - 1].label}
          </Button>
          <div className="hidden gap-1 sm:flex">
            {STOPS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to ${s.label}`}
                onClick={() => onNavigate(s.id)}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  s.id === stopIndex ? "bg-primary" : "bg-foreground/15 hover:bg-foreground/30",
                )}
              />
            ))}
          </div>
          {isLast ? (
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          ) : (
            <Button size="sm" onClick={() => onNavigate(stopIndex + 1)}>
              {STOPS[stopIndex + 1].label} <ArrowRight />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </h4>
      {children}
    </section>
  );
}

function Bullets({ items, muted }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t) => (
        <li key={t} className={cn("flex gap-2 text-sm leading-snug", muted && "text-muted-foreground")}>
          <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-current opacity-50" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Roster({ stop }: { stop: Stop }) {
  const chips: { key: string; label: string; className: string }[] = [
    ...Array.from({ length: stop.roster.tenured }, (_, i) => ({
      key: `t${i}`,
      label: "Specialist",
      className: "bg-slate-800 text-white",
    })),
    ...stop.roster.onPip.map((p) => ({
      key: p,
      label: p,
      className: "bg-amber-100 text-amber-900 ring-1 ring-amber-300",
    })),
    ...Array.from({ length: stop.roster.newHires }, (_, i) => ({
      key: `h${i}`,
      label: `New hire ${i + 1}`,
      className: "bg-primary/15 text-primary ring-1 ring-primary/30",
    })),
    { key: "brian", label: "Brian · senior specialist", className: "bg-sky-100 text-sky-900 ring-1 ring-sky-300" },
  ];
  const specialists = stop.roster.tenured + stop.roster.onPip.length + stop.roster.newHires;
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums">{specialists}</span>
        <span className="text-sm text-muted-foreground">specialists on roster + Brian</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span key={c.key} className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", c.className)}>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function HiringStepper({ stage }: { stage: number }) {
  return (
    <ol className="grid grid-cols-4 gap-1.5">
      {HIRING_STAGES.map((label, i) => (
        <li key={label} className="space-y-1">
          <div className={cn("h-1.5 rounded-full", i <= stage ? "bg-primary" : "bg-muted")} />
          <div
            className={cn(
              "text-[10px] leading-tight",
              i <= stage ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </div>
        </li>
      ))}
    </ol>
  );
}
