export type SlaStatus = "Breached" | "At risk" | "On track";

export interface TriageTicket {
  id: string;
  partner: string;
  employer: string;
  opened: string;
  status: SlaStatus;
  note: string;
}

export interface TriageGroup {
  key: string;
  title: string;
  rule: string;
  stat: string;
  statLabel: string;
  why: string;
  clusters: { label: string; tickets: TriageTicket[] }[];
}

export const TRIAGE_GROUPS: TriageGroup[] = [
  {
    key: "migration",
    title: "Batch Northbeam migration defects",
    rule: "Fix the migrated setup once with Northbeam, then run corrections as a batch instead of one wage rerun per employer.",
    stat: "29 of 37",
    statLabel: "Northbeam open tickets trace to 4 migration issues (87 est. hours, 26 employers, all GA)",
    why: "Still arriving: 9 opened Oct 1–5. This is the lever behind cutting Northbeam's ~15 opens/wk.",
    clusters: [
      {
        label: "401(k) set as post-tax at migration · 8 tickets, 4 breached",
        tickets: [
          { id: "CX-4318", partner: "Northbeam", employer: "3124", opened: "Jul 24", status: "Breached", note: "401(k) set as post-tax at migration" },
          { id: "CX-4330", partner: "Northbeam", employer: "3019", opened: "Jul 28", status: "Breached", note: "401(k) set as post-tax at migration" },
          { id: "CX-4382", partner: "Northbeam", employer: "3116", opened: "Aug 25", status: "Breached", note: "401(k) set as post-tax at migration" },
          { id: "CX-4388", partner: "Northbeam", employer: "3025", opened: "Aug 28", status: "Breached", note: "401(k) set as post-tax at migration" },
          { id: "CX-4412", partner: "Northbeam", employer: "3041", opened: "Sep 8", status: "At risk", note: "401(k) set as post-tax at migration" },
          { id: "CX-4438", partner: "Northbeam", employer: "3056", opened: "Sep 11", status: "On track", note: "401(k) set as post-tax at migration" },
          { id: "CX-4504", partner: "Northbeam", employer: "3116", opened: "Sep 23", status: "On track", note: "401(k) set as post-tax at migration" },
          { id: "CX-4668", partner: "Northbeam", employer: "3005", opened: "Oct 5", status: "On track", note: "401(k) set as post-tax at migration" },
        ],
      },
      { label: "Section 125 deduction missing since migration · 8 tickets, 2 breached", tickets: [] },
      { label: "HSA contribution taxed as wages at migration · 8 tickets, 2 breached", tickets: [] },
      { label: "Benefit deduction imported wrong at migration · 5 tickets, 1 breached", tickets: [] },
    ],
  },
  {
    key: "duplicates",
    title: "Merge likely duplicates",
    rule: "Same employer + same issue = link or merge at intake. Every “(reported by employer)” ticket has an earlier twin.",
    stat: "4 pairs",
    statLabel: "same employer, same intake note; 3 are fee-tied (Ledgerly / Crewpay)",
    why: "Likely pattern: the partner files, then the employer reports the same problem separately. No employee ID in the sheet, so a specialist confirms before merging.",
    clusters: [
      {
        label: "Ledgerly · employer 1039 · opened one day apart",
        tickets: [
          { id: "CX-4560", partner: "Ledgerly", employer: "1039", opened: "Oct 1", status: "On track", note: "Imputed income not taxed" },
          { id: "CX-4644", partner: "Ledgerly", employer: "1039", opened: "Oct 2", status: "On track", note: "Imputed income not taxed (reported by employer)" },
        ],
      },
      {
        label: "Crewpay · employer 4128 · plus a July original that reopened",
        tickets: [
          { id: "CX-4306", partner: "Crewpay", employer: "4128", opened: "Jul 17", status: "Breached", note: "Pay rate change applied twice" },
          { id: "CX-4420", partner: "Crewpay", employer: "4128", opened: "Sep 9", status: "At risk", note: "Pay rate change applied twice" },
          { id: "CX-4428", partner: "Crewpay", employer: "4128", opened: "Sep 10", status: "At risk", note: "Pay rate change applied twice (reported by employer)" },
        ],
      },
      {
        label: "Ledgerly · employer 1041 · both breached",
        tickets: [
          { id: "CX-4336", partner: "Ledgerly", employer: "1041", opened: "Jul 30", status: "Breached", note: "Retro pay processed without state withholding" },
          { id: "CX-4378", partner: "Ledgerly", employer: "1041", opened: "Aug 24", status: "Breached", note: "Retro pay processed without state withholding (reported by employer)" },
        ],
      },
      {
        label: "Northbeam · employer 3116",
        tickets: [
          { id: "CX-4382", partner: "Northbeam", employer: "3116", opened: "Aug 25", status: "Breached", note: "401(k) set as post-tax at migration" },
          { id: "CX-4504", partner: "Northbeam", employer: "3116", opened: "Sep 23", status: "On track", note: "401(k) set as post-tax at migration" },
        ],
      },
    ],
  },
  {
    key: "sizing",
    title: "Fix sizing at intake",
    rule: "Multi-month, wrong-state withholding is a state reallocation (L, ~8 h), not a tax setup fix (S, 1 h).",
    stat: "5 tickets",
    statLabel: "tagged S / 1 h but describe months of wrong-state withholding",
    why: "Under-sized work looks easy, which is exactly what the plan routes to new hires. 4 of 5 are already at risk or breached.",
    clusters: [
      {
        label: "Tagged “Tax setup correction · S”",
        tickets: [
          { id: "CX-4360", partner: "Tandem Payroll", employer: "6103", opened: "Aug 12", status: "Breached", note: "Employee has worked from home in PA since Feb; stubs show NJ withholding" },
          { id: "CX-4498", partner: "PayNest", employer: "2019", opened: "Sep 22", status: "At risk", note: "Employee commutes from KY; only OH withheld since hire" },
          { id: "CX-4500", partner: "Ledgerly", employer: "1099", opened: "Sep 22", status: "At risk", note: "Employee moved to CT in May; still withheld for NY" },
          { id: "CX-4508", partner: "Ledgerly", employer: "1072", opened: "Sep 23", status: "At risk", note: "Employee relocated NJ to NY in June; withholding still NJ" },
          { id: "CX-4456", partner: "Crewpay", employer: "4173", opened: "Sep 16", status: "On track", note: "Remote worker; work location set wrong at onboarding in July" },
        ],
      },
    ],
  },
];

export const PARTNER_PATTERNS = [
  "Ledgerly: 9 “Imputed income not taxed” tickets across 8 employers; the first 4 are breached. Possibly a setup issue on Ledgerly’s side.",
  "Crewpay: 5 “Pay rate change applied twice” tickets across 3 employers.",
];
