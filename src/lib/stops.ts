import type { PlanStepId } from "./plan-steps";
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

export interface StepAction {
  step: PlanStepId;
  action: string;
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
  activeSteps: PlanStepId[];
  stepActions: StepAction[];
  roster: {
    tenured: number;
    onPip: string[];
    newHires: number;
    note: string;
  };
  hiring: HiringStatus;
  milestones: string[];
  allocation: AllocationLane[];
  waits: string[];
  fee: { headline: string; detail: string };
  leadershipAsks: string[];
  watch: string[];
  successChecks: string[];
  mentionsTriage?: boolean;
}

export { PLAN_STEPS, planStepById } from "./plan-steps";
export type { PlanStepId } from "./plan-steps";

export const HIRING_STAGES = [
  "Roles posted",
  "Interviewing",
  "Offers accepted",
  "Started and ramping",
] as const;

export const STOPS: Stop[] = [
  {
    id: 0,
    label: "Today",
    mentionsTriage: true,
    marker: "Plan kicks off",
    period: "Week of Oct 5 — starting point",
    title: "The backlog has doubled; we act this week",
    summary:
      "Open backlog is 200 (it was 98 in early July) and SLA is 71% (it was 93%). About 108 tickets arrive or reopen each week while we finish about 93, so the queue grows by about 15 per week. All four steps of the plan start now.",
    tone: "risk",
    weekIdx: null,
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action:
          "Start intake triage and a Northbeam containment lane. Every close by Kevin or Tasha gets a second review before it counts as resolved.",
      },
      {
        step: 2,
        action:
          "Save the 14 Ledgerly and Crewpay tickets near their deadline. Spend October’s already-late finishes mostly on those fee partners. Chase the 22 waiting-on-partner tickets daily.",
      },
      {
        step: 3,
        action:
          "Post two backfill roles this week. Move Brian to about five more tickets per week on the queue. Do not wait for PIP end dates to hire.",
      },
      {
        step: 4,
        action: "Aim for finishes ahead of arrivals so the backlog starts shrinking instead of growing.",
      },
    ],
    roster: {
      tenured: 6,
      onPip: ["Kevin (PIP ends Oct 30)", "Tasha (PIP ends Nov 13)"],
      newHires: 0,
      note: "8 specialists plus Brian (senior specialist, at least 20 hours per week on the queue).",
    },
    hiring: {
      stage: 0,
      headline: "Post two backfill roles this week",
      detail:
        "Recruiting takes 4–6 weeks; we plan for the fast end so day one is about Nov 2. Waiting for PIP end dates would add another month to the staffing dip.",
    },
    milestones: [
      "Brian adds about five tickets per week on the queue (product collaboration deferred)",
      "Intake triage and Northbeam containment go live",
      "Second review on every Kevin and Tasha close",
    ],
    allocation: [
      { lane: "Ledgerly / Crewpay near deadline or already late", who: "About 3 specialists", share: 37.5 },
      { lane: "Other tickets near deadline or already late", who: "About 2 specialists", share: 25 },
      { lane: "Partner-wait chase list (the clock does not pause)", who: "About 1 specialist", share: 12.5 },
      { lane: "On-time fee tickets (with second review on PIP closes)", who: "About 2 including Kevin and Tasha", share: 25 },
    ],
    waits: [
      "Non-fee tickets that are still on time with at least 10 days left",
      "Low-severity Northbeam cleanup (batched into a migration lane)",
      "Brian’s product collaboration",
    ],
    fee: {
      headline: "$3,000 at stake if October repeats September",
      detail:
        "Ledgerly was 74% in September ($2,500 credit if October matches). Crewpay was 82% ($500). Combined open tickets: 58 + 30; already past deadline: 25 + 4.",
    },
    leadershipAsks: [
      "Approve two backfill roles now, not when the PIPs end",
      "Approve Brian’s extra ~5 tickets per week (defer product collaboration through December)",
      "Back intake triage with Northbeam (about 15 new tickets per week) and our routing team",
    ],
    watch: [
      "Without cutting incoming work and second-reviewing closes, hiring alone never catches up: about 108 arriving vs about 98 we can finish",
    ],
    successChecks: ["Two roles posted", "Fee tickets near deadline start shrinking", "New opens trending toward about 82 per week"],
  },
  {
    id: 1,
    label: "Oct 16",
    mentionsTriage: true,
    marker: "Queue shrinking",
    period: "Oct 5 – Oct 16",
    title: "The queue stops growing",
    summary:
      "Intake triage and second-review on closes bring weekly arrivals to about 93 against about 98 finishes. For the first time since July, the backlog shrinks instead of growing.",
    tone: "turning",
    weekIdx: [0, 1],
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action: "Hold opens near 82 per week and reopens near 11. Watch for opens drifting back above about 85.",
      },
      {
        step: 2,
        action:
          "Keep saving fee tickets near their deadline first, then already-late fee tickets inside October’s late-finish budget. Finish Q3-affecting work before the Oct 31 returns deadline.",
      },
      {
        step: 3,
        action: "Keep interviews moving. Goal: offers out by about Oct 19 so day one stays Nov 2.",
      },
      {
        step: 4,
        action: "Net flow should flip from +15 per week to about −5 per week if intake holds.",
      },
    ],
    roster: {
      tenured: 6,
      onPip: ["Kevin (PIP ends Oct 30)", "Tasha (PIP ends Nov 13)"],
      newHires: 0,
      note: "Full roster still producing; Kevin and Tasha closes are reviewed before resolve.",
    },
    hiring: {
      stage: 1,
      headline: "Two roles live — interviews underway",
      detail: "Goal: offers out by about Oct 19 to hold a Nov 2 start date.",
    },
    milestones: ["Net flow flips from +15 per week to about −5 per week", "Brian’s extra five tickets per week in place"],
    allocation: [
      { lane: "Fee tickets near deadline or already late", who: "About 3 specialists", share: 37.5 },
      { lane: "Other tickets near deadline or already late", who: "About 2 specialists", share: 25 },
      { lane: "Partner-wait chase list", who: "About 1 specialist", share: 12.5 },
      { lane: "On-time fee protection (second review)", who: "About 2 including Kevin and Tasha", share: 25 },
    ],
    waits: ["Deep non-fee on-time queue", "Non-critical Northbeam batch"],
    fee: {
      headline: "October fee month in progress",
      detail:
        "SLA counts tickets finished that month. An already-late ticket closed in October is a miss. The late-finish budget is about 39–40 for a ≥90% month; spend most of it on Ledgerly and Crewpay.",
    },
    leadershipAsks: ["Fast-track offer approvals so day one stays Nov 2"],
    watch: ["Opens drifting back above about 85 per week means triage is not holding"],
    successChecks: ["Backlog about 190", "Fee tickets near deadline down week over week", "Candidates in final rounds"],
  },
  {
    id: 2,
    label: "Oct 30",
    marker: "Kevin exits · Q3 returns",
    period: "Oct 19 – Oct 30",
    title: "October closes; Kevin exits",
    summary:
      "Backlog falls to about 180. Kevin’s PIP ends Oct 30 and we plan it as an exit. Both hires have accepted and start Monday, Nov 2. Q3 returns are due Oct 31.",
    tone: "turning",
    weekIdx: [2, 3],
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action: "Keep second review on remaining PIP closes. Turn Kevin’s common reopen causes into a checklist for the team.",
      },
      {
        step: 2,
        action:
          "Finish the October fee month with on-time finishes and the late-finish budget held. We cannot also clear all 52 already-late tickets and still hit 90%.",
      },
      {
        step: 3,
        action: "Kevin’s last day Oct 30. Two offers signed; onboarding ready. Approve the November–December stretch capacity.",
      },
      {
        step: 4,
        action: "Pre-build the November save list so the staffing dip does not erase October’s progress.",
      },
    ],
    roster: {
      tenured: 6,
      onPip: ["Tasha (PIP ends Nov 13)"],
      newHires: 0,
      note: "Kevin’s last day Oct 30. Two hires start Nov 2.",
    },
    hiring: {
      stage: 2,
      headline: "Two offers accepted — day one Nov 2",
      detail: "Onboarding plan: S and M tickets only for eight weeks, buddy on L, no solo XL.",
    },
    milestones: [
      "Kevin’s last day (Oct 30), with his common reopen causes turned into a checklist",
      "Q3 quarterly returns due Oct 31",
      "October SLA print for Ledgerly and Crewpay",
    ],
    allocation: [
      { lane: "Fee tickets near deadline or already late", who: "About 3 specialists", share: 37.5 },
      { lane: "Other tickets near deadline or already late", who: "About 2 specialists", share: 25 },
      { lane: "Partner-wait chase list", who: "About 1 specialist", share: 12.5 },
      { lane: "On-time fee protection + Kevin handoff", who: "About 2 including Kevin and Tasha", share: 25 },
    ],
    waits: ["Same as before, plus non-fee L and XL work that would blow the late-finish budget"],
    fee: {
      headline: "Target: October ≥90% for both fee partners",
      detail:
        "If it lands, credits fall from $3,000 to $0. Trade-off: we cannot also clear all 52 already-late tickets in October. We chose mix discipline over clearing every late ticket.",
    },
    leadershipAsks: [
      "Approve trough stretch: about +4 tickets per week (overtime or borrowed help) from Nov 2 through Dec 25",
    ],
    watch: ["Reopens must stay at or below about 11 per week while Kevin’s closes are still flowing"],
    successChecks: ["Backlog about 180", "Offers signed", "Kevin’s knowledge transfer done"],
  },
  {
    id: 3,
    label: "Nov 13",
    mentionsTriage: true,
    marker: "Hires start · Tasha exits",
    period: "Nov 2 – Nov 13",
    title: "Through the hardest staffing stretch",
    summary:
      "This is the hardest stretch. Kevin is gone, Tasha leaves Nov 13, and the new hires are at 30% productivity. Tighter intake, the stretch capacity, and Brian keep the backlog falling, to about 156.",
    tone: "recovering",
    weekIdx: [4, 5],
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action: "Hold intake discipline through the capacity dip (opens about 78, reopens about 9).",
      },
      {
        step: 2,
        action:
          "Keep fee-first work as the spine. One specialist owns tickets that came back after close, including the 17 last closed by Kevin or Tasha.",
      },
      {
        step: 3,
        action:
          "Both hires started Nov 2 on S-tag tickets only. Tasha’s last day Nov 13 — her idle and follow-up tickets get explicit new owners.",
      },
      {
        step: 4,
        action: "With stretch capacity, net shrink stays about 8–12 tickets per week even in the dip.",
      },
    ],
    roster: {
      tenured: 6,
      onPip: ["Tasha (last day Nov 13)"],
      newHires: 2,
      note: "6 tenured + 2 new hires (ramp weeks 1–2) + Brian.",
    },
    hiring: {
      stage: 3,
      headline: "Both hires started Nov 2",
      detail: "Shadowing plus S-tag tickets (tax setup, void and reissue), about 3.5 tickets per week each.",
    },
    milestones: [
      "New hires day one (Nov 2)",
      "About +4 tickets per week stretch begins",
      "Tasha’s last day (Nov 13): idle and follow-up tickets get explicit new owners",
    ],
    allocation: [
      { lane: "Fee + near-deadline spine", who: "5 specialists", share: 55 },
      { lane: "Tickets that came back after close", who: "1 specialist", share: 12 },
      { lane: "Shadowing + S-tag tickets", who: "2 new hires", share: 8 },
      { lane: "Fee L/XL + second review + hire training", who: "Brian + stretch", share: 25 },
    ],
    waits: ["Non-fee on-time tickets with comfortable slack", "Brian’s product work (frozen)"],
    fee: {
      headline: "November: fee-first continues",
      detail:
        "Saving fee tickets near their deadline stays rule one. Ledgerly is 29% of tickets and 48% of already-late tickets, so it stays the main focus.",
    },
    leadershipAsks: [
      "Proactive note to Ledgerly and Crewpay: the trend is improving and here is the plan",
    ],
    watch: [
      "Only one backfill would not replace the 20 tickets per week we lose; recovery would stall",
      "Reopens stuck at 12 or more is like losing one specialist; adds 4–8 weeks",
    ],
    successChecks: ["Backlog about 156", "Reopens at or below 9 per week", "Hires closing S tickets on their own by week 2"],
  },
  {
    id: 4,
    label: "Nov 27",
    marker: "Steady burn",
    period: "Nov 16 – Nov 27",
    title: "Steady burn on a smaller team",
    summary:
      "Six tenured specialists, two ramping hires, Brian, and the stretch produce about 89 finishes per week against about 82 arrivals. Backlog reaches about 142 and SLA climbs to about 84%.",
    tone: "recovering",
    weekIdx: [6, 7],
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action: "Hold opens near 75 per week. Reopens should fall to about 7 with second review and the PIP exits complete.",
      },
      {
        step: 2,
        action:
          "Burn remaining already-late tickets now that October’s late-finish pressure is over. Keep on-time fee tickets from aging into near-deadline.",
      },
      {
        step: 3,
        action: "Hires still at 30% through week 4; move toward 55% (simple M) from Nov 30. Line up Thanksgiving coverage early.",
      },
      {
        step: 4,
        action: "Keep a steady weekly shrink; do not let holiday weeks erase the burn.",
      },
    ],
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
    milestones: ["Reopens down to about 7 per week", "Opens held at about 75 per week"],
    allocation: [
      { lane: "Fee + near-deadline + already-late burn", who: "About 60% of capacity", share: 60 },
      { lane: "Quality / tickets that came back", who: "About 20%", share: 20 },
      { lane: "Hire ramp work (real S tickets)", who: "About 20%", share: 20 },
    ],
    waits: ["Non-fee on-time tickets with comfortable slack", "Brian’s product work (still frozen)"],
    fee: {
      headline: "Fee partners trending up with the queue",
      detail: "Already-late fee stock keeps shrinking; near-deadline saves keep the November mix clean.",
    },
    leadershipAsks: ["Hold the line on Brian’s product freeze through December"],
    watch: ["Holiday weeks dip finishes (Labor Day week: 82 resolved), so plan coverage early"],
    successChecks: ["Backlog about 142", "Reopens about 7 per week", "No new fee-partner tickets past their deadline"],
  },
  {
    id: 5,
    label: "Dec 11",
    mentionsTriage: true,
    marker: "Hires at 55%",
    period: "Nov 30 – Dec 11",
    title: "Hires at 55%; SLA nears 90%",
    summary:
      "Hires move to 55% and capacity climbs to about 95 finishes per week. The backlog falls fastest here, to about 117, and SLA reaches about 89%.",
    tone: "recovering",
    weekIdx: [8, 9],
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action: "Keep opens at or below about 78 as Northbeam containment eases. Reopens at or below 6 per week.",
      },
      {
        step: 2,
        action: "As already-late stock clears, shift focus to keeping tickets on time—fee partners first.",
      },
      {
        step: 3,
        action: "Hires on solo S and simple M; buddy on L. Confirm December holiday coverage so capacity holds.",
      },
      {
        step: 4,
        action: "This is the fastest burn stretch; stay on track for crossing 90% in the week of Dec 14.",
      },
    ],
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
    milestones: ["Capacity back to about 95 per week, close to pre-exit levels", "Already-late stock mostly cleared"],
    allocation: [
      { lane: "Prevent new late tickets (on-time fee first)", who: "About 45%", share: 45 },
      { lane: "Remaining already-late + near-deadline burn", who: "About 30%", share: 30 },
      { lane: "Tickets that came back (until reopens ≤ 6/wk)", who: "About 10%", share: 10 },
      { lane: "Hire work: S + simple M", who: "2 new hires", share: 15 },
    ],
    waits: ["Non-fee on-time tickets with at least 10 days of slack", "Brian’s product work"],
    fee: {
      headline: "December pass rate tracking toward 90%",
      detail: "Fewer already-late tickets left to close means more of December’s finishes are on time.",
    },
    leadershipAsks: ["Confirm December holiday coverage (Dec 14–25) so capacity holds"],
    watch: ["Incoming work creeping back up as Northbeam containment ends; keep opens at or below about 78"],
    successChecks: ["Backlog about 117", "SLA about 89%", "Reopens at or below 6 per week"],
  },
  {
    id: 6,
    label: "Year-end",
    marker: "90%+ SLA · ~100 backlog",
    period: "Dec 14 – Dec 25",
    title: "Back to 90%+ with a healthy backlog",
    summary:
      "The backlog returns to the healthy level near 100 (about 94) and SLA is back above 90%, the July level. We got here without counting on Kevin or Tasha improving.",
    tone: "healthy",
    weekIdx: [10, 11],
    activeSteps: [1, 2, 3, 4],
    stepActions: [
      {
        step: 1,
        action: "Keep a light second-review sample (about 10% of closes) until reopens stay at or below 6 per week.",
      },
      {
        step: 2,
        action: "Normal first-in, first-out with fee partners still prioritized. Both fee partners at ≥90% monthly.",
      },
      {
        step: 3,
        action:
          "Hires take solo S and simple M. Stretch tapers from early January as hires reach 80%. Agree when Brian returns to product work.",
      },
      {
        step: 4,
        action:
          "Hold arrivals plus reopens at least five below finishes until the backlog is stable near 100. Agree the done bar with leadership.",
      },
    ],
    roster: {
      tenured: 6,
      onPip: [],
      newHires: 2,
      note: "6 tenured + 2 new (ramp weeks 7–8; 80% from Jan 4, full about Feb 1) + Brian.",
    },
    hiring: {
      stage: 3,
      headline: "Ramp weeks 7–8 at 55% → 80% in January",
      detail: "Hires take solo S and simple M; buddy on anything partner-sensitive.",
    },
    milestones: [
      "SLA ≥ 90%: crosses the line in the week of Dec 14",
      "Backlog back in the healthy band (near 100)",
      "Stretch tapers off from Jan 4 as hires reach 80%",
    ],
    allocation: [
      { lane: "On-time flow: fee then other, oldest first", who: "About 70%", share: 70 },
      { lane: "Light second-review sample (10% of closes)", who: "About 10%", share: 10 },
      { lane: "Hire work: solo S + simple M", who: "2 new hires", share: 20 },
    ],
    waits: ["Nothing urgent waits; normal first-in, first-out with fee tickets prioritized"],
    fee: {
      headline: "Both fee partners ≥90% monthly",
      detail:
        "Done means a ≥90% monthly print two months running, which keeps credits at $0 on $15k per month of fees tied to SLA.",
    },
    leadershipAsks: [
      "Agree the done bar: backlog 90–110, SLA ≥90% two months running, reopens at or below 6 per week",
      "Agree when Brian returns to product work",
    ],
    watch: [],
    successChecks: ["Backlog about 94", "SLA ≥ 90%", "Reopens at or below 6 per week"],
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

export function outcomeLine(stop: Stop, m: StopMetrics, prev: StopMetrics | null): string {
  const backlogPart =
    prev == null
      ? `Open backlog ${Math.round(m.backlog)}`
      : `Open backlog about ${Math.round(prev.backlog)} → ${Math.round(m.backlog)}`;
  const slaLabel = m.slaIsActual ? "SLA" : "SLA (estimated from backlog size)";
  const slaPart = `${slaLabel} about ${Math.round(m.sla)}%`;
  const net =
    m.netPerWeek > 0
      ? `Queue growing by about ${Math.abs(m.netPerWeek).toFixed(0)} tickets per week`
      : `Queue shrinking by about ${Math.abs(m.netPerWeek).toFixed(0)} tickets per week`;
  return `${backlogPart}. ${slaPart}. ${net}.`;
}

export const slipOutcome = {
  backlog: slipWeeks[slipWeeks.length - 1].backlogEnd,
  sla: slipWeeks[slipWeeks.length - 1].sla,
};

