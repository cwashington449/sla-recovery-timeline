"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Filter,
  Flag,
  Hourglass,
  ListOrdered,
  Megaphone,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

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
import { cn } from "@/lib/utils";
import { HIRING_STAGES, STOPS, metricsFor, slipOutcome, type Stop } from "@/lib/stops";
import { ToneBadge, fmtDelta } from "@/components/tone";

interface StopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stopIndex: number;
  onNavigate: (index: number) => void;
  onShowTriage: () => void;
}

export function StopDialog({ open, onOpenChange, stopIndex, onNavigate, onShowTriage }: StopDialogProps) {
  const stop = STOPS[stopIndex];
  const m = metricsFor(stop);
  const prev = stopIndex > 0 ? metricsFor(STOPS[stopIndex - 1]) : null;
  const isFirst = stopIndex === 0;
  const isLast = stopIndex === STOPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Kpi
              label="Open backlog"
              value={Math.round(m.backlog).toString()}
              sub={prev ? fmtDelta(m.backlog - prev.backlog, "vs last stop") : "was 98 in July"}
              good={prev ? m.backlog < prev.backlog : undefined}
            />
            <Kpi
              label={m.slaIsActual ? "SLA (last week)" : "SLA (proxy)"}
              value={`${Math.round(m.sla)}%`}
              sub={m.sla >= 90 ? "at / above target" : `${Math.round(90 - m.sla)} pts to 90%`}
              good={m.sla >= 90}
            />
            <Kpi label="Resolves / wk" value={m.capacity.toFixed(0)} sub={isFirst ? "98 with Brian +5" : "avg this period"} />
            <Kpi
              label="Demand / wk"
              value={m.demand.toFixed(0)}
              sub={`${m.opens.toFixed(0)} opens + ${m.reopens.toFixed(0)} reopens`}
            />
            <Kpi
              label="Net backlog / wk"
              value={`${m.netPerWeek > 0 ? "+" : "−"}${Math.abs(m.netPerWeek).toFixed(0)}`}
              sub={m.netPerWeek > 0 ? "growing" : "shrinking"}
              good={m.netPerWeek <= 0}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={<Users className="size-4" />} title="Head count & capacity">
              <Roster stop={stop} />
              <p className="mt-2 text-xs text-muted-foreground">{stop.roster.note}</p>
              <CapacityBar mix={m.capacityMix} />
              <p className="mt-2 text-xs text-muted-foreground">
                Effective specialist capacity ≈ <span className="font-medium text-foreground">{m.effectiveFte.toFixed(1)} FTE</span>{" "}
                (1 FTE ≈ 11.6 tickets/wk)
              </p>
            </Section>

            <Section icon={<Briefcase className="size-4" />} title="Hiring & ramp-up">
              <HiringStepper stage={stop.hiring.stage} />
              <p className="mt-3 text-sm font-medium">{stop.hiring.headline}</p>
              <p className="text-xs text-muted-foreground">{stop.hiring.detail}</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground">
                    New-hire productivity {m.hireRampWeek > 0 ? `· ramp week ${m.hireRampWeek} of 13` : "· not started"}
                  </span>
                  <span className="font-mono font-medium tabular-nums">{m.hireRampPct}%</span>
                </div>
                <Progress value={m.hireRampPct} />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>30% wk 1–4</span>
                  <span>55% wk 5–8</span>
                  <span>80% wk 9–12</span>
                  <span>100% ~Feb 1</span>
                </div>
              </div>
            </Section>
          </div>

          <Section icon={<ListOrdered className="size-4" />} title="Resource allocation">
            <div className="space-y-2.5">
              {stop.allocation.map((a) => (
                <div key={a.lane}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span>{a.lane}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.who}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${a.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={<Flag className="size-4" />} title="Priorities this period">
              <Bullets items={stop.focus} />
              {stop.mentionsTriage && (
                <button
                  type="button"
                  onClick={onShowTriage}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Filter className="size-3.5" /> See intake triage examples from the queue
                </button>
              )}
            </Section>
            <Section icon={<Hourglass className="size-4" />} title="What waits">
              <Bullets items={stop.waits} muted />
            </Section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={<CircleDollarSign className="size-4" />} title="Fee-tied partners">
              <p className="text-sm font-medium">{stop.fee.headline}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stop.fee.detail}</p>
            </Section>
            <Section icon={<CheckCircle2 className="size-4" />} title="Milestones">
              <Bullets items={stop.milestones} />
            </Section>
          </div>

          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Megaphone className="size-4" />
              What we need from leadership
            </div>
            <Bullets items={stop.leadershipAsks} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={<CheckCircle2 className="size-4" />} title="We'll know it's working when">
              <div className="flex flex-wrap gap-1.5">
                {stop.successChecks.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </Section>
            {stop.watch.length > 0 ? (
              <Section icon={<AlertTriangle className="size-4" />} title="Watch for">
                <Bullets items={stop.watch} muted />
              </Section>
            ) : (
              <Section icon={<AlertTriangle className="size-4" />} title="Buffer">
                <p className="text-sm text-muted-foreground">
                  If the hires start a week late (Nov 9), the model still finishes the year at about{" "}
                  <span className="font-medium text-foreground">
                    {Math.round(slipOutcome.backlog)} backlog and ~{Math.round(slipOutcome.sla)}% SLA
                  </span>
                  .
                </p>
              </Section>
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

function Kpi({ label, value, sub, good }: { label: string; value: string; sub: string; good?: boolean }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2.5">
      <div className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{label}</div>
      <div
        className={cn(
          "font-mono text-xl font-semibold tabular-nums",
          good === true && "text-primary",
          good === false && "text-amber-600",
        )}
      >
        {value}
      </div>
      <div className="truncate text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </h3>
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
    ...stop.roster.onPip.map((p) => ({ key: p, label: p, className: "bg-amber-100 text-amber-900 ring-1 ring-amber-300" })),
    ...Array.from({ length: stop.roster.newHires }, (_, i) => ({
      key: `h${i}`,
      label: `New hire ${i + 1}`,
      className: "bg-primary/15 text-primary ring-1 ring-primary/30",
    })),
    { key: "brian", label: "Brian · SME", className: "bg-sky-100 text-sky-900 ring-1 ring-sky-300" },
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

const MIX_SEGMENTS = [
  { key: "tenured", label: "6 tenured", className: "bg-slate-800" },
  { key: "pip", label: "Kevin/Tasha", className: "bg-amber-400" },
  { key: "brian", label: "Brian +5", className: "bg-sky-400" },
  { key: "hires", label: "New hires", className: "bg-primary" },
  { key: "stretch", label: "Stretch +4", className: "bg-violet-400" },
] as const;

function CapacityBar({ mix }: { mix: Record<(typeof MIX_SEGMENTS)[number]["key"], number> }) {
  const total = MIX_SEGMENTS.reduce((s, seg) => s + mix[seg.key], 0);
  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">Where resolves come from (tickets/wk)</span>
        <span className="font-mono font-medium tabular-nums">{total.toFixed(0)}</span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {MIX_SEGMENTS.map((seg) =>
          mix[seg.key] > 0 ? (
            <div key={seg.key} className={seg.className} style={{ width: `${(mix[seg.key] / 110) * 100}%` }} />
          ) : null,
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {MIX_SEGMENTS.filter((seg) => mix[seg.key] > 0).map((seg) => (
          <span key={seg.key} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className={cn("size-2 rounded-sm", seg.className)} />
            {seg.label} <span className="font-mono text-foreground tabular-nums">{mix[seg.key].toFixed(0)}</span>
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
          <div className={cn("text-[10px] leading-tight", i <= stage ? "font-medium text-foreground" : "text-muted-foreground")}>
            {label}
          </div>
        </li>
      ))}
    </ol>
  );
}
