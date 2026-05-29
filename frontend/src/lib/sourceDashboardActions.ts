export type SourceDashboardAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  sourceProjects: string[];
  examples: string[];
  count: number;
};

export const sourceDashboardActions: SourceDashboardAction[] = [
  {
    "id": "saas-inventory",
    "label": "SaaS Inventory",
    "description": "SaaS Inventory action group for Software Procurement Negotiator.",
    "href": "/saas-inventory",
    "sourceProjects": [
      "SaaS contracts",
      "Usage exports"
    ],
    "examples": [
      "Open SaaS Inventory",
      "Review Spend",
      "Run SaaS Inventory AI check"
    ],
    "count": 3
  },
  {
    "id": "usage-shelfware",
    "label": "Usage Shelfware",
    "description": "Usage Shelfware action group for Software Procurement Negotiator.",
    "href": "/usage-shelfware",
    "sourceProjects": [
      "Usage exports",
      "Renewal notices"
    ],
    "examples": [
      "Open Usage Shelfware",
      "Review Optimization",
      "Run Usage Shelfware AI check"
    ],
    "count": 3
  },
  {
    "id": "renewal-calendar",
    "label": "Renewal Calendar",
    "description": "Renewal Calendar action group for Software Procurement Negotiator.",
    "href": "/renewal-calendar",
    "sourceProjects": [
      "Renewal notices",
      "Benchmark data"
    ],
    "examples": [
      "Open Renewal Calendar",
      "Review Renewals",
      "Run Renewal Calendar AI check"
    ],
    "count": 3
  },
  {
    "id": "benchmark-pricing",
    "label": "Benchmark Pricing",
    "description": "Benchmark Pricing action group for Software Procurement Negotiator.",
    "href": "/benchmark-pricing",
    "sourceProjects": [
      "Benchmark data"
    ],
    "examples": [
      "Open Benchmark Pricing",
      "Review Negotiation",
      "Run Benchmark Pricing AI check"
    ],
    "count": 3
  },
  {
    "id": "negotiation-playbook",
    "label": "Negotiation Playbook",
    "description": "Negotiation Playbook action group for Software Procurement Negotiator.",
    "href": "/negotiation-playbook",
    "sourceProjects": [
      "SaaS contracts",
      "Usage exports"
    ],
    "examples": [
      "Open Negotiation Playbook",
      "Review Negotiation",
      "Run Negotiation Playbook AI check"
    ],
    "count": 3
  },
  {
    "id": "security-review-queue",
    "label": "Security Review Queue",
    "description": "Security Review Queue action group for Software Procurement Negotiator.",
    "href": "/security-review-queue",
    "sourceProjects": [
      "Usage exports",
      "Renewal notices"
    ],
    "examples": [
      "Open Security Review Queue",
      "Review Risk",
      "Run Security Review Queue AI check"
    ],
    "count": 3
  },
  {
    "id": "budget-impact",
    "label": "Budget Impact",
    "description": "Budget Impact action group for Software Procurement Negotiator.",
    "href": "/budget-impact",
    "sourceProjects": [
      "Renewal notices",
      "Benchmark data"
    ],
    "examples": [
      "Open Budget Impact",
      "Review Finance",
      "Run Budget Impact AI check"
    ],
    "count": 3
  },
  {
    "id": "vendor-scorecards",
    "label": "Vendor Scorecards",
    "description": "Vendor Scorecards action group for Software Procurement Negotiator.",
    "href": "/vendor-scorecards",
    "sourceProjects": [
      "Benchmark data"
    ],
    "examples": [
      "Open Vendor Scorecards",
      "Review Vendor Management",
      "Run Vendor Scorecards AI check"
    ],
    "count": 3
  },
  {
    "id": "approval-workflow",
    "label": "Approval Workflow",
    "description": "Approval Workflow action group for Software Procurement Negotiator.",
    "href": "/approval-workflow",
    "sourceProjects": [
      "SaaS contracts",
      "Usage exports"
    ],
    "examples": [
      "Open Approval Workflow",
      "Review Governance",
      "Run Approval Workflow AI check"
    ],
    "count": 3
  },
  {
    "id": "executive-savings-report",
    "label": "Executive Savings Report",
    "description": "Executive Savings Report action group for Software Procurement Negotiator.",
    "href": "/executive-savings-report",
    "sourceProjects": [
      "Usage exports",
      "Renewal notices"
    ],
    "examples": [
      "Open Executive Savings Report",
      "Review Reporting",
      "Run Executive Savings Report AI check"
    ],
    "count": 3
  }
];
