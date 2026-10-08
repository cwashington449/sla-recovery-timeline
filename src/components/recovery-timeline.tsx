"use client";

import { ArrowLeft, ArrowRight, Check, Gauge, Inbox, Link2, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { StopDialog } from "@/components/stop-dialog";
import { ToneBadge } from "@/components/tone";
import { TrajectoryChart } from "@/components/trajectory-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PLAN_STEPS, STOPS, metricsFor, slipOutcome } from "@/lib/stops";
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
  const active = new Set(current.activeSteps);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Payroll Support · Recovery plan
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Back to 90%+ SLA by year-end
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Four steps, twelve weeks. Slide through the plan two weeks at a time — each stop opens the detail on what
            changes, why, and what we need from leadership.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copyLink} className="self-start sm:self-auto">
          {copied ? <Check /> : <Link2 />}
          {copied ? "Link copied" : "Copy link to this stop"}
        </Button>
      </header>

      <section className="mt-8" aria-label="The plan in four steps">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">The plan in four steps</h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {PLAN_STEPS.map((step) => {
            const isActive = active.has(step.id);
            return (
              <li
                key={step.id}
                className={cn(
                  "rounded-xl border px-4 py-3 transition-colors",
                  isActive ? "border-primary/40 bg-primary/5" : "border-border/60 bg-muted/30 opacity-60",
                )}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold tabular-nums",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {step.id}
                  </span>
                  <h3 className={cn("text-sm font-semibold", !isActive && "text-muted-foreground")}>{step.title}</h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.blurb}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <StatCard
          icon={<Inbox className="size-4" />}
          label="Open backlog"
          value={Math.round(m.backlog).toString()}
          foot={stop === 0 ? "Healthy level about 100 (July)" : "Healthy band 90–110"}
          tone={m.backlog <= 110 ? "good" : stop === 0 ? "bad" : "neutral"}
        />
        <StatCard
          icon={<Gauge className="size-4" />}
          label={m.slaIsActual ? "SLA" : "SLA (estimated from backlog)"}
          value={`${Math.round(m.sla)}%`}
          foot={m.sla >= 90 ? "Target met" : `Target 90% · ${Math.round(90 - m.sla)} points to go`}
          tone={m.sla >= 90 ? "good" : stop === 0 ? "bad" : "neutral"}
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
            <Button
              variant="outline"
              size="icon"
              disabled={stop === 0}
              onClick={() => goTo(stop - 1, true)}
              aria-label="Previous stop"
            >
              <ArrowLeft />
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Maximize2 /> Stop details
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={stop === LAST}
              onClick={() => goTo(stop + 1, true)}
              aria-label="Next stop"
            >
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
              const align =
                i === 0 ? "translate-x-0 text-left" : i === LAST ? "-translate-x-full text-right" : "-translate-x-1/2 text-center";
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
          <CardTitle>Open backlog and SLA, week by week</CardTitle>
          <CardDescription>
            Solid lines are where we are on the slider; dashed lines are the rest of the plan. Shaded band is the healthy
            backlog (90–110).
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

      <footer className="mt-10 space-y-2 border-t pt-6 text-center text-xs leading-relaxed text-muted-foreground">
        <p>
          If we do not cut incoming work, 90% slips to about March — even with the same two hires. One-week hire delay
          still finishes the year around {Math.round(slipOutcome.sla)}% SLA ({Math.round(slipOutcome.backlog)} backlog).
        </p>
        <p>
          Tip: ← / → step through the stops. The URL updates as you move, so you can share a link to any stop.{" "}
          <a
            href={DATA_PACK_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Source: Backlog Recovery Plan — Data Pack ↗
          </a>
        </p>
      </footer>

      <StopDialog open={open} onOpenChange={setOpen} stopIndex={stop} onNavigate={(i) => goTo(i, true)} />
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

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-0.5 w-4 rounded", className)} />
      {label}
    </span>
  );
}
