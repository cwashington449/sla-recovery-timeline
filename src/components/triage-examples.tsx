"use client";

import { ChevronDown, Copy, Layers, Ruler } from "lucide-react";
import { useState, type ReactNode } from "react";

import { PARTNER_PATTERNS, TRIAGE_GROUPS, type SlaStatus, type TriageGroup } from "@/lib/triage";
import { cn } from "@/lib/utils";

export const TRIAGE_SECTION_ID = "triage-examples";

const ICONS: Record<string, ReactNode> = {
  migration: <Layers className="size-4" />,
  duplicates: <Copy className="size-4" />,
  sizing: <Ruler className="size-4" />,
};

const STATUS_STYLE: Record<SlaStatus, string> = {
  Breached: "bg-red-50 text-red-700 ring-red-200",
  "At risk": "bg-amber-50 text-amber-800 ring-amber-200",
  "On track": "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export function TriageExamples() {
  return (
    <section id={TRIAGE_SECTION_ID} className="mt-10 scroll-mt-6">
      <h2 className="text-lg font-semibold tracking-tight">What intake triage looks like in today&apos;s queue</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
        Real tickets from the Queue Snapshot. Each pattern is a rule we apply to new tickets as they arrive. The open
        tickets that match get merged or batched now.
      </p>
      <div className="mt-4 grid items-start gap-3 lg:grid-cols-3">
        {TRIAGE_GROUPS.map((g) => (
          <GroupCard key={g.key} group={g} />
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-dashed bg-card/60 p-4">
        <div className="text-xs font-semibold">Root-cause conversations to open with partners</div>
        <ul className="mt-1.5 space-y-1">
          {PARTNER_PATTERNS.map((p) => (
            <li key={p} className="text-xs leading-relaxed text-muted-foreground">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GroupCard({ group }: { group: TriageGroup }) {
  const [open, setOpen] = useState(false);
  const ticketCount = group.clusters.reduce((s, c) => s + c.tickets.length, 0);

  return (
    <div className="flex flex-col rounded-xl border bg-card p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-primary">{ICONS[group.key]}</span>
        {group.title}
      </h3>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums">{group.stat}</span>
      </div>
      <p className="text-xs text-muted-foreground">{group.statLabel}</p>
      <p className="mt-3 text-sm leading-snug">{group.rule}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{group.why}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        {open ? "Hide tickets" : `Show ${ticketCount} example tickets`}
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {group.clusters.map((c) => (
            <div key={c.label}>
              <div className="text-[11px] font-medium text-muted-foreground">{c.label}</div>
              {c.tickets.length > 0 && (
                <ul className="mt-1.5 space-y-1.5">
                  {c.tickets.map((t) => (
                    <li key={t.id} className="rounded-lg bg-muted/50 px-2.5 py-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-medium">{t.id}</span>
                        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1", STATUS_STYLE[t.status])}>
                          {t.status}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {t.partner} · emp {t.employer} · opened {t.opened}
                      </div>
                      <div className="text-xs leading-snug">{t.note}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
