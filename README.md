# Payroll Support · Path back to 90%+ SLA

Interactive walkthrough of the Payroll Support recovery plan for the Head of Support and the President.

**Four steps** stay visible on the page. A **two-week slider** moves from today (backlog 200, SLA 71%) to year-end (backlog near 100, SLA ≥90%). Each stop opens a popup with:

- why this period matters
- what each plan step looks like these two weeks
- what waits, and what we need from leadership
- optional detail (roster, hiring, fee notes, intake triage examples)

The URL hash (`#stop-1` … `#stop-7`) tracks the current stop. Use ← / → to step through stops.

## Run locally

```bash
npm install
npm run dev -- -p 43219
```

Open http://localhost:43219.

## Share via URL

`npm run build` writes a fully static site to `out/`. Any static host works (Vercel, Netlify via `netlify.toml`, Cloudflare Pages with output `out`).

## Where the numbers come from

- **Facts**: *Backlog Recovery Plan — Data Pack* (Summary, Queue Snapshot, History, Start Here).
- **Model** (`src/lib/model.ts`): weekly flow `backlog += opens + reopens − resolves`. Capacity is the six tenured specialists, plus Kevin and Tasha until their PIP end dates, Brian (+5), two hires starting Nov 2 on a 30/55/80/100% ramp, and a +4/week stretch from Nov 2 to Dec 25. After today, SLA is estimated from backlog size using the History trend.
- **Stop content** (`src/lib/stops.ts`): period actions and leadership asks aligned to the four-step plan.
