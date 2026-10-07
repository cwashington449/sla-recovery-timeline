import { BASELINE, TICKETS_PER_SPECIALIST, planWeeks, slipWeeks, type WeekRow } from "./model";

export type Tone = "risk" | "turning" | "recovering" | "healthy";

export interface AllocationLane {
  lane: string;
  who: string;
  share: number;
}

export interface HiringStatus {
  /** 0 = posting, 1 = interviewing, 2 = offers accepted, 3 = started / ramping */
  stage: 0 | 1 | 2 | 3;
  headline: string;
  detail: string;
}

export interface Stop {
  id: number;
  label: string;
  marker: string;
  period: string;
  title: string;
  summary: string;
  tone: Tone;
  weekIdx: [number, number] | null;
  roster: {
    tenured: number;
    onPip: string[];
    newHires: number;
    note: string;
  };
  hiring: HiringStatus;
  milestones: string[];
  allocation: AllocationLane[];
  focus: string[];
  waits: string[];
  fee: { headline: string; detail: string };
  leadershipAsks: string[];
  watch: string[];
  successChecks: string[];
  mentionsTriage?: boolean;
}

export const HIRING_STAGES = ["Reqs posted", "Interviewing", "Offers accepted", "Started & ramping"] as const;

export const STOPS: Stop[] = [
  {
    id: 0,
    label: "Today",
    mentionsTriage: true,
    marker: "Plan kicks off",
    period: "Week of Oct 5 — starting point",
    title: "Backlog has doubled; we act this week",
    summary:
      "Backlog is 200 (98 in early July) and SLA is 71% (93%). Demand of ~108/wk (95 opens + 13 reopens) outruns 93 resolves, so the queue grows ~15/wk. Every lever starts this week.",
    tone: "risk",
    weekIdx: null,
    roster: {
      tenured: 6,
      onPip: ["Kevin (PIP → Oct 30)", "Tasha (PIP → Nov 13)"],
      newHires: 0,
      note: "8 specialists + Brian (Senior SME, ≥20 h/wk on queue).",
    },
    hiring: {
      stage: 0,
      headline: "Post 2 backfill reqs this week",
      detail:
        "Recruiting takes 4–6 weeks; we plan to the fast end (4) for a Nov 2 start. Waiting for PIP end dates would add a month to the trough.",
    },
    milestones: [
      "Brian moves +5 tickets/wk onto the queue (product collaboration deferred)",
      "Intake triage + Northbeam containment lane goes live",
      "Close-QA: every Kevin/Tasha close gets a second pair of eyes",
    ],
    allocation: [
      { lane: "Fee-tied at risk + breached (Ledgerly / Crewpay)", who: "~3 specialists", share: 37.5 },
      { lane: "Other at-risk + actionable breaches", who: "~2 specialists", share: 25 },
      { lane: "Partner-wait chase list (clock doesn't pause)", who: "~1 specialist", share: 12.5 },
      { lane: "On-track fee protection (dual-control closes)", who: "~2 incl. Kevin & Tasha", share: 25 },
    ],
    focus: [
      "Save the 14 fee-tied at-risk tickets (0–3 days to SLA)",
      "Burn the 29 fee-tied breaches inside October's late budget",
      "Out-of-quarter / Q3-affecting at-risk work before Oct 31 returns",
      "Escalate the 22 waiting-on-partner tickets daily",
    ],
    waits: [
      "Non-fee on-track tickets with ≥10 days to SLA",
      "Low-severity Northbeam cleanup (batched into a migration lane)",
      "Brian's product collaboration",
    ],
    fee: {
      headline: "$3,000 at stake if October repeats September",
      detail: "Ledgerly 74% in Sept → $2,500 credit; Crewpay 82% → $500. 58 + 30 open, 25 + 4 breached.",
    },
    leadershipAsks: [
      "Approve 2 backfill reqs now, not at PIP end dates",
      "Approve Brian's +5/wk (defer product collaboration through December)",
      "Back intake triage with Northbeam (15 opens/wk) and our routing team",
    ],
    watch: [
      "Without intake triage + close-QA, hiring alone never catches up: 108 demand vs ~98 max supply",
    ],
    successChecks: ["Reqs posted", "Fee at-risk stock starts shrinking", "Opens tracking toward ~82/wk"],
  },
  {
    id: 1,
    label: "Oct 16",
    mentionsTriage: true,
    marker: "Queue shrinking",
    period: "Oct 5 – Oct 16",
    title: "Queue stops growing",
    summary:
      "Intake triage and close-QA bring demand to ~93/wk against 98 resolves. For the first time since July the backlog shrinks instead of growing.",
    tone: "turning",
    weekIdx: [0, 1],
    roster: {
      tenured: 6,
      onPip: ["Kevin (PIP → Oct 30)", "Tasha (PIP → Nov 13)"],
      newHires: 0,
      note: "Full roster still producing; Kevin & Tasha closes are reviewed before resolve.",
    },
    hiring: {
      stage: 1,
      headline: "2 reqs live — interviews underway",
      detail: "Goal: offers out by ~Oct 19 to hold a Nov 2 start date.",
    },
    milestones: ["Net flow flips from +15/wk to −5/wk", "Brian's +5/wk in place"],
    allocation: [
      { lane: "Fee-tied at risk + breached", who: "~3 specialists", share: 37.5 },
      { lane: "Other at-risk + actionable breaches", who: "~2 specialists", share: 25 },
      { lane: "Partner-wait chase list", who: "~1 specialist", share: 12.5 },
      { lane: "On-track fee protection (dual-control)", who: "~2 incl. Kevin & Tasha", share: 25 },
    ],
    focus: [
      "Fee at-risk saves first, then fee breaches on the late budget",
      "Q3-affecting work ahead of the Oct 31 returns deadline",
      "Brian: XL/L fee tickets + close-QA review of PIP closes",
    ],
    waits: ["Non-fee on-track deep queue", "Non-critical Northbeam batch"],
    fee: {
      headline: "October fee month in progress",
      detail:
        "SLA% counts resolves, so a breached ticket closed in October is a miss. Late budget ≈ 39–40 breached resolves for a ≥90% month; spend it mostly on Ledgerly / Crewpay.",
    },
    leadershipAsks: ["Fast-track offer approvals so day one stays Nov 2"],
    watch: ["Opens drifting back above ~85/wk means triage isn't holding"],
    successChecks: ["Backlog ~190", "Fee at-risk stock down week over week", "Candidates in final rounds"],
  },
  {
    id: 2,
    label: "Oct 30",
    marker: "Kevin exits · Q3 returns",
    period: "Oct 19 – Oct 30",
    title: "October closes; Kevin exits",
    summary:
      "Backlog falls to ~180. Kevin's PIP ends Oct 30 and we plan it as an exit. Both hires have accepted and start Monday, Nov 2. Q3 returns are due Oct 31.",
    tone: "turning",
    weekIdx: [2, 3],
    roster: {
      tenured: 6,
      onPip: ["Tasha (PIP → Nov 13)"],
      newHires: 0,
      note: "Kevin's last day Oct 30. 2 hires start Nov 2.",
    },
    hiring: {
      stage: 2,
      headline: "2 offers accepted — day one Nov 2",
      detail: "Onboarding plan ready: S/M tickets only for 8 weeks, buddy on L, no solo XL.",
    },
    milestones: [
      "Kevin's last day (Oct 30), with his common reopen causes turned into a QA checklist",
      "Q3 quarterly returns due Oct 31",
      "October SLA print for Ledgerly & Crewpay",
    ],
    allocation: [
      { lane: "Fee-tied at risk + breached", who: "~3 specialists", share: 37.5 },
      { lane: "Other at-risk + actionable breaches", who: "~2 specialists", share: 25 },
      { lane: "Partner-wait chase list", who: "~1 specialist", share: 12.5 },
      { lane: "On-track fee protection + Kevin handoff", who: "~2 incl. Kevin & Tasha", share: 25 },
    ],
    focus: [
      "Finish the October fee month strong (on-time resolves, late budget held)",
      "Kevin hands over his open work; Tasha stays on dual-control",
      "Pre-build the November save-list",
    ],
    waits: ["Same as before, plus non-fee L/XL that would blow the late budget"],
    fee: {
      headline: "Target: October ≥90% for both fee partners",
      detail:
        "If it lands, credits fall from $3,000 to $0. Trade-off: we can't also clear all 52 breaches in October. We chose mix discipline over clearing breaches.",
    },
    leadershipAsks: ["Approve trough stretch: +4 tickets/wk (overtime or borrowed help) Nov 2 – Dec 25"],
    watch: ["Reopens must stay ≤ ~11/wk while Kevin's closes are still flowing"],
    successChecks: ["Backlog ~180", "Offers signed", "Kevin's knowledge transfer done"],
  },
  {
    id: 3,
    label: "Nov 13",
    mentionsTriage: true,
    marker: "Hires start · Tasha exits",
    period: "Nov 2 – Nov 13",
    title: "Through the exit trough",
    summary:
      "This is the hardest stretch. Kevin is gone, Tasha leaves Nov 13, and the new hires are at 30%. Tighter intake, the +4 stretch and Brian keep the backlog falling, to ~156.",
    tone: "recovering",
    weekIdx: [4, 5],
    roster: {
      tenured: 6,
      onPip: ["Tasha (last day Nov 13)"],
      newHires: 2,
      note: "6 tenured + 2 new hires (ramp weeks 1–2) + Brian.",
    },
    hiring: {
      stage: 3,
      headline: "Both hires started Nov 2",
      detail: "Shadowing + S-tag tickets (tax setup, void & reissue), ~3.5 tickets/wk each.",
    },
    milestones: [
      "New hires day one (Nov 2)",
      "+4/wk trough stretch begins",
      "Tasha's last day (Nov 13): her idle / follow-up tickets get explicit new owners",
    ],
    allocation: [
      { lane: "Fee + at-risk spine", who: "5 specialists", share: 55 },
      { lane: "Reopen repair lane (25 reopened stock + new)", who: "1 specialist", share: 12 },
      { lane: "Shadowing + S-tag tickets", who: "2 new hires", share: 8 },
      { lane: "Fee L/XL + close-QA + hire training", who: "Brian + stretch", share: 25 },
    ],
    focus: [
      "Hold intake discipline through the capacity dip (opens ~78, reopens ~9)",
      "Reopen lane works the 17 reopened tickets last closed by Kevin/Tasha",
      "Partner-wait list owned daily",
    ],
    waits: ["Non-fee on-track with comfortable slack", "Brian's product work (frozen)"],
    fee: {
      headline: "November: fee-first continues",
      detail: "Fee at-risk saves stay rule #1. Ledgerly is 29% of tickets and 48% of breaches, so it stays the main focus.",
    },
    leadershipAsks: ["Proactive note to Ledgerly & Crewpay: the trend is improving and here's the plan"],
    watch: [
      "Only 1 backfill wouldn't replace the 20 tickets/wk we lose; recovery would stall",
      "Reopens stuck ≥12 = losing ~1 specialist; adds 4–8 weeks",
    ],
    successChecks: ["Backlog ~156", "Reopens ≤ 9/wk", "Hires closing S tickets solo by week 2"],
  },
  {
    id: 4,
    label: "Nov 27",
    marker: "Steady burn",
    period: "Nov 16 – Nov 27",
    title: "Steady burn on a smaller team",
    summary:
      "6 tenured specialists, 2 ramping hires, Brian and the stretch produce ~89/wk against ~82 demand. Backlog reaches ~142 and SLA climbs to ~84%.",
    tone: "recovering",
    weekIdx: [6, 7],
    roster: {
      tenured: 6,
      onPip: [],
      newHires: 2,
      note: "PIP exits complete. 6 tenured + 2 new (ramp weeks 3–4) + Brian.",
    },
    hiring: {
      stage: 3,
      headline: "Ramp weeks 3–4 at 30%",
      detail: "Real S tickets in volume; moving to 55% (simple M) from Nov 30.",
    },
    milestones: ["Reopens down to ~7/wk with close-QA and PIP exits", "Opens held at ~75/wk"],
    allocation: [
      { lane: "Fee + at-risk + breach burn", who: "~60% of capacity", share: 60 },
      { lane: "Reopen / quality lane", who: "~20%", share: 20 },
      { lane: "Hire ramp work (real S tickets)", who: "~20%", share: 20 },
    ],
    focus: [
      "Breach burn now that the October late budget pressure is over",
      "Keep on-track fee tickets from aging into at-risk",
      "Thanksgiving week (Nov 26): line up PTO coverage in advance",
    ],
    waits: ["Non-fee on-track with comfortable slack", "Brian's product work (still frozen)"],
    fee: {
      headline: "Fee partners trending up with the queue",
      detail: "Breached fee stock keeps shrinking; at-risk saves keep the November mix clean.",
    },
    leadershipAsks: ["Hold the line on Brian's product freeze through December"],
    watch: ["Holiday weeks dip resolves (Labor Day week: 82 resolved), so plan coverage early"],
    successChecks: ["Backlog ~142", "Reopens ~7/wk", "No new fee-tied breaches"],
  },
  {
    id: 5,
    label: "Dec 11",
    mentionsTriage: true,
    marker: "Hires at 55%",
    period: "Nov 30 – Dec 11",
    title: "Hires at 55%; SLA nears 90%",
    summary:
      "Hires move to 55% and capacity climbs to ~95/wk. The backlog falls fastest here, to ~117, and SLA reaches ~89%.",
    tone: "recovering",
    weekIdx: [8, 9],
    roster: {
      tenured: 6,
      onPip: [],
      newHires: 2,
      note: "6 tenured + 2 new (ramp weeks 5–6) + Brian + stretch.",
    },
    hiring: {
      stage: 3,
      headline: "Ramp weeks 5–6 at 55%",
      detail: "Solo S and simple M (wage rerun / backout in open quarter); buddy on L.",
    },
    milestones: ["Capacity back to ~95/wk, close to pre-exit levels", "Breach stock mostly cleared"],
    allocation: [
      { lane: "Prevent new breaches (on-track fee first)", who: "~45%", share: 45 },
      { lane: "Remaining breach + at-risk burn", who: "~30%", share: 30 },
      { lane: "Reopen lane (until reopens ≤ 6/wk)", who: "~10%", share: 10 },
      { lane: "Hire work: S + simple M", who: "2 new hires", share: 15 },
    ],
    focus: [
      "As breaches clear, focus shifts to keeping tickets on time",
      "Keep the reopen lane until reopens ≤ 6/wk",
    ],
    waits: ["Non-fee on-track with ≥10 days of slack", "Brian's product work"],
    fee: {
      headline: "December pass rate tracking toward 90%",
      detail: "Fewer breached tickets left to close means more of December's resolves are on time.",
    },
    leadershipAsks: ["Confirm December holiday coverage (Dec 14–25) so capacity holds"],
    watch: ["Intake creeping back up as Northbeam containment ends; keep opens ≤ ~78"],
    successChecks: ["Backlog ~117", "SLA ~89%", "Reopens ≤ 6/wk"],
  },
  {
    id: 6,
    label: "Year-end",
    marker: "90%+ SLA · ~100 backlog",
    period: "Dec 14 – Dec 25",
    title: "Back to 90%+ with a healthy backlog",
    summary:
      "The backlog returns to the healthy ~100 level (~94) and SLA is back above 90%, the July level. We got here without counting on Kevin or Tasha improving.",
    tone: "healthy",
    weekIdx: [10, 11],
    roster: {
      tenured: 6,
      onPip: [],
      newHires: 2,
      note: "6 tenured + 2 new (ramp weeks 7–8; 80% from Jan 4, full ~Feb 1) + Brian.",
    },
    hiring: {
      stage: 3,
      headline: "Ramp weeks 7–8 at 55% → 80% in January",
      detail: "Hires take solo S and simple M; buddy on anything partner-sensitive.",
    },
    milestones: [
      "SLA ≥ 90%: crosses the line in the week of Dec 14",
      "Backlog back in the healthy band (~100)",
      "Stretch tapers off from Jan 4 as hires reach 80%",
    ],
    allocation: [
      { lane: "On-time flow: fee then other, oldest first", who: "~70%", share: 70 },
      { lane: "Light QA sample (10% of closes)", who: "~10%", share: 10 },
      { lane: "Hire work: solo S + simple M", who: "2 new hires", share: 20 },
    ],
    focus: [
      "Hold opens + reopens ≤ resolves − 5 until the backlog is stable near 100",
      "Brian returns to some product time only after 2 clean weeks at ≥90%",
    ],
    waits: ["Nothing urgent waits; normal first-in, first-out with fee tickets prioritized"],
    fee: {
      headline: "Both fee partners ≥90% monthly",
      detail: "Done means a ≥90% monthly print two months running, which keeps credits at $0 on $15k/mo of SLA-linked fees.",
    },
    leadershipAsks: [
      "Agree the 'done' bar: backlog 90–110, SLA ≥90% two months running, reopens ≤6/wk",
      "Agree when Brian returns to product work",
    ],
    watch: [],
    successChecks: ["Backlog ~94", "SLA ≥ 90%", "Reopens ≤ 6/wk"],
  },
];

export interface StopMetrics {
  backlog: number;
  sla: number;
  slaIsActual: boolean;
  capacity: number;
  opens: number;
  reopens: number;
  demand: number;
  netPerWeek: number;
  effectiveFte: number;
  hireRampPct: number;
  hireRampWeek: number;
  capacityMix: { tenured: number; pip: number; brian: number; hires: number; stretch: number };
}

function avg(rows: WeekRow[], pick: (w: WeekRow) => number): number {
  return rows.reduce((s, w) => s + pick(w), 0) / rows.length;
}

export function metricsFor(stop: Stop, weeks: WeekRow[] = planWeeks): StopMetrics {
  if (!stop.weekIdx) {
    return {
      backlog: BASELINE.backlog,
      sla: BASELINE.slaPct,
      slaIsActual: true,
      capacity: BASELINE.teamResolvesPerWeek,
      opens: BASELINE.trendOpens,
      reopens: BASELINE.trendReopens,
      demand: BASELINE.trendOpens + BASELINE.trendReopens,
      netPerWeek: BASELINE.netPerWeek,
      effectiveFte: 8,
      hireRampPct: 0,
      hireRampWeek: 0,
      capacityMix: { tenured: 73, pip: 20, brian: 0, hires: 0, stretch: 0 },
    };
  }
  const rows = weeks.slice(stop.weekIdx[0], stop.weekIdx[1] + 1);
  const last = rows[rows.length - 1];
  const capacity = avg(rows, (w) => w.capacity);
  const demand = avg(rows, (w) => w.demand);
  const mix = {
    tenured: avg(rows, (w) => w.tenured),
    pip: avg(rows, (w) => w.pip),
    brian: avg(rows, (w) => w.brian),
    hires: avg(rows, (w) => w.hires),
    stretch: avg(rows, (w) => w.stretch),
  };
  return {
    backlog: last.backlogEnd,
    sla: last.sla,
    slaIsActual: false,
    capacity,
    opens: avg(rows, (w) => w.opens),
    reopens: avg(rows, (w) => w.reopens),
    demand,
    netPerWeek: demand - capacity,
    effectiveFte: (last.tenured + last.pip + last.hires) / TICKETS_PER_SPECIALIST,
    hireRampPct: last.hireRampPct,
    hireRampWeek: Math.max(0, last.hireRampWeek),
    capacityMix: mix,
  };
}

export const slipOutcome = {
  backlog: slipWeeks[slipWeeks.length - 1].backlogEnd,
  sla: slipWeeks[slipWeeks.length - 1].sla,
};
