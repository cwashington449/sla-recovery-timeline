export type PlanStepId = 1 | 2 | 3 | 4;

export interface PlanStep {
  id: PlanStepId;
  title: string;
  blurb: string;
}

/** The recovery plan boiled down for leadership. */
export const PLAN_STEPS: PlanStep[] = [
  {
    id: 1,
    title: "Cut incoming work",
    blurb:
      "Triage new tickets, contain Northbeam volume, and second-review closes so fewer tickets come back.",
  },
  {
    id: 2,
    title: "Close the right tickets",
    blurb:
      "Save partners with fees tied to SLA first; spend the month’s already-late budget carefully; chase partner waits daily.",
  },
  {
    id: 3,
    title: "Cover the staffing dip",
    blurb:
      "Treat the two PIPs as exits, hire two replacements now, keep Brian’s extra capacity, and stretch through November.",
  },
  {
    id: 4,
    title: "Burn down to a healthy queue",
    blurb: "Keep finishes ahead of new work until the open backlog is near 100 and SLA is back above 90%.",
  },
];

export function planStepById(id: PlanStepId): PlanStep {
  const step = PLAN_STEPS.find((s) => s.id === id);
  if (!step) throw new Error(`Unknown plan step: ${id}`);
  return step;
}
