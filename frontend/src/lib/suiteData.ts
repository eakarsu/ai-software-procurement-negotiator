export type Metric = { label: string; value: string; note: string };
export const sourceSystems = [
  {
    "name": "SaaS contracts",
    "ownership": "SaaS contracts contributes operating evidence, workflows, control signals, and reporting inputs to Software Procurement Negotiator.",
    "coverage": [
      "SaaS Inventory",
      "Usage Shelfware",
      "AI tools",
      "Audit evidence"
    ]
  },
  {
    "name": "Usage exports",
    "ownership": "Usage exports contributes operating evidence, workflows, control signals, and reporting inputs to Software Procurement Negotiator.",
    "coverage": [
      "Usage Shelfware",
      "Renewal Calendar",
      "AI tools",
      "Audit evidence"
    ]
  },
  {
    "name": "Renewal notices",
    "ownership": "Renewal notices contributes operating evidence, workflows, control signals, and reporting inputs to Software Procurement Negotiator.",
    "coverage": [
      "Renewal Calendar",
      "Benchmark Pricing",
      "AI tools",
      "Audit evidence"
    ]
  },
  {
    "name": "Benchmark data",
    "ownership": "Benchmark data contributes operating evidence, workflows, control signals, and reporting inputs to Software Procurement Negotiator.",
    "coverage": [
      "Benchmark Pricing",
      "Negotiation Playbook",
      "AI tools",
      "Audit evidence"
    ]
  }
];

export const dashboardMetrics: Metric[] = [
  { label: 'Workflow Areas', value: '10', note: 'Dedicated modules' },
  { label: 'Evidence Sources', value: '4', note: 'Mapped sources' },
  { label: 'AI Tools', value: '13', note: 'Suite copilots' },
  { label: 'Open Work', value: '64', note: 'Across workflows' },
];

export const healthMetrics: Metric[] = [
  { label: 'Connector Health', value: '96%', note: 'Pilot baseline' },
  { label: 'Audit Coverage', value: '100%', note: 'All workflows logged' },
  { label: 'Review Queue', value: '22', note: 'Needs owner action' },
  { label: 'Automation Runs', value: '344', note: 'Last 24 hours' },
];

export const dashboardModules = [
  "SaaS Inventory operating view",
  "Usage Shelfware operating view",
  "Renewal Calendar operating view",
  "Benchmark Pricing operating view",
  "Negotiation Playbook operating view",
  "Security Review Queue operating view",
  "Budget Impact operating view",
  "Vendor Scorecards operating view"
];
export const workflowHighlights = [
  "SaaS Inventory workflow with records, AI assist, approvals, audit, and reporting",
  "Usage Shelfware workflow with records, AI assist, approvals, audit, and reporting",
  "Renewal Calendar workflow with records, AI assist, approvals, audit, and reporting",
  "Benchmark Pricing workflow with records, AI assist, approvals, audit, and reporting",
  "Negotiation Playbook workflow with records, AI assist, approvals, audit, and reporting",
  "Security Review Queue workflow with records, AI assist, approvals, audit, and reporting"
];
