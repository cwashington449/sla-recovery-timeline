# Payroll Support · Path back to 90%+ SLA

An interactive presentation of the Payroll Support recovery plan for the Head of Support and the President. A slider moves through the plan in two-week stops, from today (backlog 200, SLA 71%) to year-end (backlog ~100, SLA ≥90%). Each stop opens a dialog covering:

- backlog, SLA, resolves vs demand, and net flow
- head count and where weekly capacity comes from (tenured team, Kevin/Tasha, Brian, new hires, stretch)
- hiring stage and new-hire ramp-up
- resource allocation by work lane
- priorities, what waits, fee-tied partner status, milestones
- what we need from leadership, success checks, and risks

The URL hash (`#stop-1` … `#stop-7`) tracks the current stop, so a link can open at any point in the plan. Use ← / → to step through stops.

## Run locally

```bash
npm install
npm run dev -- -p 43219
```

Open http://localhost:43219.

## Share via URL

`npm run build` writes a fully static site to `out/`. Any static host works:

- **Vercel**: import the repo; no configuration needed.
- **Netlify**: "Add new site → Import an existing project", pick this repo. `netlify.toml` already sets the build command (`npm run build`) and publish directory (`out`).
- **Cloudflare Pages**: build command `npm run build`, output directory `out`.

## Where the numbers come from

- **Facts**: *Backlog Recovery Plan — Data Pack* (Summary, Queue Snapshot, History, Start Here).
- **Model** (`src/lib/model.ts`): weekly flow `backlog += opens + reopens − resolves`. Capacity is the 6 tenured specialists (73/wk), plus Kevin and Tasha (10/wk each until Oct 30 and Nov 13), Brian (+5), 2 hires starting Nov 2 on a 30/55/80/100% ramp, and a +4/wk stretch from Nov 2 to Dec 25. SLA is a backlog proxy fitted to the History trend: `93 − 0.22 × (backlog − 100)`, capped at 93.
- **Stop content** (`src/lib/stops.ts`): allocation, priorities, and leadership asks from the SLA recovery path plan.
