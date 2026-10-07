"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gauge,
  Inbox,
  Link2,
  Maximize2,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { StopDialog } from "@/components/stop-dialog";
import { ToneBadge, fmtDelta } from "@/components/tone";
import { TRIAGE_SECTION_ID, TriageExamples } from "@/components/triage-examples";
import { TrajectoryChart } from "@/components/trajectory-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { STOPS, metricsFor, slipOutcome } from "@/lib/stops";
import { cn } from "@/lib/utils";

const LAST = STOPS.length - 1;
const DATA_PACK_URL =
  "https://docs.google.com/spreadsheets/d/1ExOo6aU0ZY36PVrMxqPfFt9yznVtKZp13AvL8FO2B5M/";

function readHashStop(): number | null {
  const match = window.location.hash.match(/stop-(\d+)/);
  if (!match) return null;
  const n = Number(match[1]) - 1;
  return n >= 0 && n <= LAST ? n : null;
}

export function RecoveryTimeline() {
  const [stop, setStop] = useState(0);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sync = () => {
      const fromHash = readHashStop();
      if (fromHash !== null) setStop(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const goTo = useCallback((next: number, openDialog: boolean) => {
    const clamped = Math.max(0, Math.min(LAST, next));
    setStop(clamped);
    window.history.replaceState(null, "", `#stop-${clamped + 1}`);
    if (openDialog) setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-slot=slider], input, textarea")) return;
      if (e.key === "ArrowRight") goTo(stop + 1, true);
      if (e.key === "ArrowLeft") goTo(stop - 1, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, stop]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const current = STOPS[stop];
  const m = metricsFor(current);
  const start = metricsFor(STOPS[0]);
  const specialists = current.roster.tenured + current.roster.onPip.length + current.roster.newHires;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Payroll Support · Recovery plan
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Back to 90%+ SLA by year-end
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Twelve weeks, three levers, and a team that gets smaller before it grows. Use the slider to step through the
            plan two weeks at a time. Each stop shows who is working on what, where hiring stands, and what we need from
            leadership.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copyLink} className="self-start sm:self-auto">
          {copied ? <Check /> : <Link2 />}
          {copied ? "Link copied" : "Copy link to this stop"}
        </Button>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Inbox className="size-4" />}
          label="Open backlog"
          value={Math.round(m.backlog).toString()}
          foot={stop === 0 ? "Healthy level ≈ 100 (July)" : fmtDelta(m.backlog - start.backlog, "since today")}
          tone={m.backlog <= 110 ? "good" : stop === 0 ? "bad" : "neutral"}
        />
        <StatCard
          icon={<Gauge className="size-4" />}
          label={m.slaIsActual ? "Resolved within SLA" : "SLA (backlog proxy)"}
          value={`${Math.round(m.sla)}%`}
          foot={m.sla >= 90 ? "Target met" : `Target 90% · ${Math.round(90 - m.sla)} pts to go`}
          tone={m.sla >= 90 ? "good" : stop === 0 ? "bad" : "neutral"}
        />
        <StatCard
          icon={<Workflow className="size-4" />}
          label="Resolves vs demand / wk"
          value={`${m.capacity.toFixed(0)} vs ${m.demand.toFixed(0)}`}
          foot={
            m.netPerWeek > 0
              ? `Backlog growing +${m.netPerWeek.toFixed(0)}/wk`
              : `Backlog shrinking ${Math.abs(m.netPerWeek).toFixed(0)}/wk`
          }
          tone={m.netPerWeek <= 0 ? "good" : "bad"}
        />
        <StatCard
          icon={<Users className="size-4" />}
          label="Specialists + Brian"
          value={`${specialists} + 1`}
          foot={
            current.roster.newHires > 0
              ? `${current.roster.newHires} new hires at ${m.hireRampPct}%`
              : current.roster.onPip.length > 0
                ? `${current.roster.onPip.length} on PIP · reqs ${stop === 0 ? "posting" : "open"}`
                : "—"
          }
          tone="neutral"
        />
      </section>

      <Card className="mt-6">
        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl">{current.label === "Today" ? "Today" : current.label}</CardTitle>
              <ToneBadge tone={current.tone} />
            </div>
            <CardDescription className="mt-1">
              <span className="font-medium text-foreground">{current.title}.</span> {current.period}
            </CardDescription>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="icon" disabled={stop === 0} onClick={() => goTo(stop - 1, true)} aria-label="Previous stop">
              <ArrowLeft />
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Maximize2 /> Stop details
            </Button>
            <Button variant="outline" size="icon" disabled={stop === LAST} onClick={() => goTo(stop + 1, true)} aria-label="Next stop">
              <ArrowRight />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="px-1 pt-2 pb-1">
            <Slider
              value={[stop]}
              min={0}
              max={LAST}
              step={1}
              onValueChange={(v) => {
                const next = Array.isArray(v) ? v[0] : v;
                setStop(next);
                window.history.replaceState(null, "", `#stop-${next + 1}`);
              }}
              onValueCommitted={() => setOpen(true)}
              aria-label="Two-week stops"
              className="**:data-[slot=slider-thumb]:size-5 **:data-[slot=slider-thumb]:border-2 **:data-[slot=slider-thumb]:border-primary **:data-[slot=slider-track]:h-2"
            />
          </div>
          <ol className="relative mt-3 hidden h-14 sm:block">
            {STOPS.map((s, i) => {
              const pct = (i / LAST) * 100;
              const align = i === 0 ? "translate-x-0 text-left" : i === LAST ? "-translate-x-full text-right" : "-translate-x-1/2 text-center";
              return (
                <li key={s.id} className={cn("absolute top-0 w-28", align)} style={{ left: `${pct}%` }}>
                  <button
                    type="button"
                    onClick={() => goTo(i, true)}
                    className={cn(
                      "w-full rounded-md px-1 py-0.5 transition-colors hover:bg-muted",
                      i === stop ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <div className={cn("text-xs", i === stop ? "font-semibold" : "font-medium")}>{s.label}</div>
                    <div className="text-[10px] leading-tight">{s.marker}</div>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground sm:hidden">
            <span>Today</span>
            <span className="font-medium text-foreground">{current.marker}</span>
            <span>Year-end</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Backlog and SLA, week by week</CardTitle>
          <CardDescription>
            Solid = where we are on the slider; dashed = the rest of the plan. Shaded band = healthy backlog (90–110).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrajectoryChart stopIndex={stop} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Legend className="bg-chart-2" label="Open backlog (left axis)" />
            <Legend className="bg-chart-1" label="SLA % (right axis)" />
          </div>
        </CardContent>
      </Card>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Why the plan works</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Hiring alone can&apos;t close the gap: even with Brian, today&apos;s demand (95 opens + 13 reopens) is ~10/wk more than
          we can resolve. So all three levers run at the same time, starting this week.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Lever
            title="Flow: less work coming in"
            points={[
              "Intake triage: batch Northbeam migration defects and merge duplicates. Opens 95 → ~75–82/wk",
              "Close-QA on every Kevin/Tasha close: reopens 13 → ~6/wk",
              "Result: resolves beat demand every week from Oct 5",
            ]}
          />
          <Lever
            title="Mix: close the right tickets"
            points={[
              "Fee-tied at-risk first, then fee-tied breaches within the late budget",
              "Partner-wait chased daily, because the SLA clock keeps running",
              "Deep non-fee on-track work waits when we're oversubscribed",
            ]}
          />
          <Lever
            title="People: cover the exit trough"
            points={[
              "Plan Kevin (Oct 30) and Tasha (Nov 13) as exits",
              "2 backfills posted now → start Nov 2 → 55% by Dec",
              "Brian +5/wk and a +4/wk stretch through December",
            ]}
          />
        </div>
      </section>

      <TriageExamples />

      <section className="mt-10 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-primary" /> How to read the numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Facts</span> come from the data pack (Summary, Queue
              Snapshot, History). Today: backlog 200, SLA 71%, 93 resolves/wk (20 from Kevin + Tasha), Brian +5 available,
              hires take 4–6 weeks to recruit and ~3 months to ramp.
            </p>
            <p>
              <span className="font-medium text-foreground">Projections</span> use weekly flow: backlog change = opens +
              reopens − resolves. SLA is a backlog proxy from the History trend (100 backlog ≈ 93%, 200 ≈ 71%). The proxy
              doesn&apos;t predict exact monthly prints.
            </p>
            <p>
              <span className="font-medium text-foreground">Assumptions beyond the sheet:</span> hires start Nov 2 (4-week
              recruit), ramp at 30% / 55% / 80% / 100% in four-week steps, +4/wk overtime or borrowed help from Nov 2 to
              Dec 25, and the intake and reopen targets above. Holiday dips aren&apos;t modeled.
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">If something slips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Hires start a week late:</span> still ~{Math.round(slipOutcome.sla)}% SLA by
                year-end (~{Math.round(slipOutcome.backlog)} backlog).
              </li>
              <li>
                <span className="font-medium text-foreground">Only 1 backfill:</span> doesn&apos;t replace 20 tickets/wk;
                recovery stalls.
              </li>
              <li>
                <span className="font-medium text-foreground">Reopens stay ≥12:</span> like losing a specialist; adds 4–8
                weeks.
              </li>
              <li>
                <span className="font-medium text-foreground">No intake triage:</span> backlog grows through November; 90%
                slides to ~March.
              </li>
            </ul>
            <a
              href={DATA_PACK_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Source: Backlog Recovery Plan — Data Pack ↗
            </a>
          </CardContent>
        </Card>
      </section>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        Tip: ← / → step through the stops. The URL updates as you move, so you can share a link to any stop.
      </p>

      <StopDialog
        open={open}
        onOpenChange={setOpen}
        stopIndex={stop}
        onNavigate={(i) => goTo(i, true)}
        onShowTriage={() => {
          setOpen(false);
          setTimeout(() => document.getElementById(TRIAGE_SECTION_ID)?.scrollIntoView({ behavior: "smooth" }), 200);
        }}
      />
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  foot,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  foot: string;
  tone: "good" | "bad" | "neutral";
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-mono text-2xl font-semibold tabular-nums transition-colors sm:text-3xl",
          tone === "good" && "text-primary",
          tone === "bad" && "text-red-600",
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{foot}</div>
    </div>
  );
}

function Lever({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex gap-2 text-sm leading-snug text-muted-foreground">
            <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-0.5 w-4 rounded", className)} />
      {label}
    </span>
  );
}
