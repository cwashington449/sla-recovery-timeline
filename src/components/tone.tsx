import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/stops";

const TONE: Record<Tone, { label: string; className: string }> = {
  risk: { label: "Off track today", className: "bg-red-50 text-red-700 ring-red-200" },
  turning: { label: "Turning the corner", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  recovering: { label: "Recovering", className: "bg-sky-50 text-sky-800 ring-sky-200" },
  healthy: { label: "Healthy", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
};

export function ToneBadge({ tone }: { tone: Tone }) {
  const t = TONE[tone];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium ring-1", t.className)}>{t.label}</span>
  );
}

export function fmtDelta(delta: number, suffix: string): string {
  const r = Math.round(delta);
  if (r === 0) return `flat ${suffix}`;
  return `${r > 0 ? "+" : "−"}${Math.abs(r)} ${suffix}`;
}
