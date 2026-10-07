export const BASELINE = {
  backlog: 200,
  slaPct: 71,
  healthyBacklog: 100,
  julyBacklog: 98,
  julySlaPct: 93,
  teamResolvesPerWeek: 93,
  pipResolvesPerWeek: 20,
  brianFlex: 5,
  trendOpens: 95,
  trendNorthbeamOpens: 15,
  trendReopens: 13,
  netPerWeek: 15,
} as const;

export const TICKETS_PER_SPECIALIST = BASELINE.teamResolvesPerWeek / 8;
const TENURED_SIX = BASELINE.teamResolvesPerWeek - BASELINE.pipResolvesPerWeek;
const PER_PIP = BASELINE.pipResolvesPerWeek / 2;
const HIRES = 2;
const TROUGH_STRETCH = 4;

const WEEK_STARTS = [
  "2026-10-05",
  "2026-10-12",
  "2026-10-19",
  "2026-10-26",
  "2026-11-02",
  "2026-11-09",
  "2026-11-16",
  "2026-11-23",
  "2026-11-30",
  "2026-12-07",
  "2026-12-14",
  "2026-12-21",
] as const;

const KEVIN_LAST_WEEK = "2026-10-26";
const TASHA_LAST_WEEK = "2026-11-09";
const OT_FIRST_WEEK = "2026-11-02";
const OT_LAST_WEEK = "2026-12-21";

/** Intake-triage + close-QA targets per week (opens, reopens). */
const DEMAND: Record<(typeof WEEK_STARTS)[number], [number, number]> = {
  "2026-10-05": [82, 11],
  "2026-10-12": [82, 11],
  "2026-10-19": [82, 11],
  "2026-10-26": [82, 11],
  "2026-11-02": [78, 9],
  "2026-11-09": [78, 9],
  "2026-11-16": [75, 7],
  "2026-11-23": [75, 7],
  "2026-11-30": [75, 7],
  "2026-12-07": [76, 6],
  "2026-12-14": [77, 6],
  "2026-12-21": [78, 6],
};

/** Ramp curve (plan assumption D): wks 1–4 30%, 5–8 55%, 9–12 80%, then 100%. */
export function rampPct(weekOfRamp: number): number {
  if (weekOfRamp < 1) return 0;
  if (weekOfRamp <= 4) return 30;
  if (weekOfRamp <= 8) return 55;
  if (weekOfRamp <= 12) return 80;
  return 100;
}

export function slaProxy(backlog: number): number {
  return Math.min(93, 93 - 0.22 * (backlog - 100));
}

export interface WeekRow {
  start: string;
  label: string;
  opens: number;
  reopens: number;
  demand: number;
  tenured: number;
  pip: number;
  brian: number;
  hires: number;
  stretch: number;
  capacity: number;
  backlogStart: number;
  backlogEnd: number;
  sla: number;
  hireRampWeek: number;
  hireRampPct: number;
}

function shortDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function weeksBetween(fromIso: string, toIso: string): number {
  const ms = Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`);
  return Math.round(ms / (7 * 24 * 3600 * 1000));
}

export function simulate(hireStartIso: string): WeekRow[] {
  let backlog: number = BASELINE.backlog;
  return WEEK_STARTS.map((start) => {
    const [opens, reopens] = DEMAND[start];
    const pip =
      (start <= KEVIN_LAST_WEEK ? PER_PIP : 0) + (start <= TASHA_LAST_WEEK ? PER_PIP : 0);
    const hireRampWeek = weeksBetween(hireStartIso, start) + 1;
    const hireRampPct = rampPct(hireRampWeek);
    const hires = HIRES * TICKETS_PER_SPECIALIST * (hireRampPct / 100);
    const stretch = start >= OT_FIRST_WEEK && start <= OT_LAST_WEEK ? TROUGH_STRETCH : 0;
    const capacity = TENURED_SIX + pip + BASELINE.brianFlex + hires + stretch;
    const demand = opens + reopens;
    const backlogStart = backlog;
    backlog = backlog + demand - capacity;
    return {
      start,
      label: shortDate(start),
      opens,
      reopens,
      demand,
      tenured: TENURED_SIX,
      pip,
      brian: BASELINE.brianFlex,
      hires,
      stretch,
      capacity,
      backlogStart,
      backlogEnd: backlog,
      sla: slaProxy(backlog),
      hireRampWeek,
      hireRampPct,
    };
  });
}

export const PLAN_HIRE_START = "2026-11-02";
export const SLIP_HIRE_START = "2026-11-09";

export const planWeeks = simulate(PLAN_HIRE_START);
export const slipWeeks = simulate(SLIP_HIRE_START);
