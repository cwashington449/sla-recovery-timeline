"use client";

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { BASELINE, planWeeks } from "@/lib/model";

const chartConfig = {
  backlog: { label: "Open backlog", color: "var(--chart-2)" },
  sla: { label: "SLA %", color: "var(--chart-1)" },
} satisfies ChartConfig;

interface Point {
  idx: number;
  label: string;
  backlog: number;
  sla: number;
  backlogDone: number | null;
  backlogAhead: number | null;
  slaDone: number | null;
  slaAhead: number | null;
}

function fridayLabel(mondayIso: string): string {
  const d = new Date(`${mondayIso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 4);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

const RAW = [
  { label: "Oct 2", backlog: BASELINE.backlog, sla: BASELINE.slaPct },
  ...planWeeks.map((w) => ({ label: fridayLabel(w.start), backlog: w.backlogEnd, sla: w.sla })),
];

export function TrajectoryChart({ stopIndex }: { stopIndex: number }) {
  const cut = stopIndex * 2;
  const data: Point[] = RAW.map((p, idx) => ({
    idx,
    label: p.label,
    backlog: p.backlog,
    sla: p.sla,
    backlogDone: idx <= cut ? p.backlog : null,
    backlogAhead: idx >= cut ? p.backlog : null,
    slaDone: idx <= cut ? p.sla : null,
    slaAhead: idx >= cut ? p.sla : null,
  }));
  const current = data[cut];

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full sm:h-[300px]">
      <ComposedChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="idx"
          type="number"
          domain={[0, RAW.length - 1]}
          ticks={data.filter((d) => d.idx % 2 === 0).map((d) => d.idx)}
          tickFormatter={(i: number) => (i === 0 ? "Today" : (RAW[i]?.label ?? ""))}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis
          yAxisId="backlog"
          domain={[60, 220]}
          ticks={[60, 100, 140, 180, 220]}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={44}
        />
        <YAxis
          yAxisId="sla"
          orientation="right"
          domain={[60, 100]}
          ticks={[60, 70, 80, 90, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={44}
        />
        <ReferenceArea
          yAxisId="backlog"
          y1={90}
          y2={110}
          fill="var(--chart-1)"
          fillOpacity={0.08}
          ifOverflow="hidden"
        />
        <ReferenceLine
          yAxisId="sla"
          y={90}
          stroke="var(--chart-1)"
          strokeDasharray="4 4"
          label={{ value: "90% SLA", position: "insideTopRight", fontSize: 10, fill: "var(--chart-1)" }}
        />
        <ReferenceLine yAxisId="backlog" x={cut} stroke="var(--foreground)" strokeOpacity={0.25} />
        <Tooltip
          cursor={{ stroke: "var(--border)" }}
          content={({ active, payload }) => {
            const p = active && payload?.[0] ? (payload[0].payload as Point) : null;
            if (!p) return null;
            return (
              <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
                <div className="mb-1 font-medium">{p.idx === 0 ? "Today (week of Sep 28 actual)" : `Week ending ${p.label}`}</div>
                <div className="flex justify-between gap-6">
                  <span className="text-muted-foreground">Backlog</span>
                  <span className="font-mono tabular-nums">{Math.round(p.backlog)}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-muted-foreground">{p.idx === 0 ? "SLA" : "SLA (proxy)"}</span>
                  <span className="font-mono tabular-nums">{Math.round(p.sla)}%</span>
                </div>
              </div>
            );
          }}
        />
        <Line
          yAxisId="backlog"
          dataKey="backlogAhead"
          stroke="var(--color-backlog)"
          strokeOpacity={0.3}
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
        <Line
          yAxisId="sla"
          dataKey="slaAhead"
          stroke="var(--color-sla)"
          strokeOpacity={0.3}
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
        <Line
          yAxisId="backlog"
          dataKey="backlogDone"
          stroke="var(--color-backlog)"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
        <Line
          yAxisId="sla"
          dataKey="slaDone"
          stroke="var(--color-sla)"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
        <ReferenceDot yAxisId="backlog" x={cut} y={current.backlog} r={5} fill="var(--color-backlog)" stroke="white" strokeWidth={2} />
        <ReferenceDot yAxisId="sla" x={cut} y={current.sla} r={5} fill="var(--color-sla)" stroke="white" strokeWidth={2} />
      </ComposedChart>
    </ChartContainer>
  );
}
