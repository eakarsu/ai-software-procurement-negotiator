export type EntityRecord = { id: string; name: string; status: string; owner: string; amount?: string; dueDate?: string; priority?: string };
export type FeatureEntitySet = { title: string; columns: string[]; rows: EntityRecord[] };
const COLUMNS = ['Name', 'Status', 'Owner', 'Amount', 'Due Date', 'Priority'];
const entitySeeds = [
  [
    "saas-inventory",
    "SaaS Inventory Records",
    "SaaS Inventory priority queue",
    "Open",
    "SaaS Inventory exception list",
    "Spend Lead",
    "$0"
  ],
  [
    "usage-shelfware",
    "Usage Shelfware Records",
    "Usage Shelfware priority queue",
    "Review",
    "Usage Shelfware exception list",
    "Optimization Lead",
    "$0"
  ],
  [
    "renewal-calendar",
    "Renewal Calendar Records",
    "Renewal Calendar priority queue",
    "Action needed",
    "Renewal Calendar exception list",
    "Renewals Lead",
    "$0"
  ],
  [
    "benchmark-pricing",
    "Benchmark Pricing Records",
    "Benchmark Pricing priority queue",
    "Open",
    "Benchmark Pricing exception list",
    "Negotiation Lead",
    "$0"
  ],
  [
    "negotiation-playbook",
    "Negotiation Playbook Records",
    "Negotiation Playbook priority queue",
    "Review",
    "Negotiation Playbook exception list",
    "Negotiation Lead",
    "$0"
  ],
  [
    "security-review-queue",
    "Security Review Queue Records",
    "Security Review Queue priority queue",
    "Action needed",
    "Security Review Queue exception list",
    "Risk Lead",
    "$0"
  ],
  [
    "budget-impact",
    "Budget Impact Records",
    "Budget Impact priority queue",
    "Open",
    "Budget Impact exception list",
    "Finance Lead",
    "$0"
  ],
  [
    "vendor-scorecards",
    "Vendor Scorecards Records",
    "Vendor Scorecards priority queue",
    "Review",
    "Vendor Scorecards exception list",
    "Vendor Management Lead",
    "$0"
  ],
  [
    "approval-workflow",
    "Approval Workflow Records",
    "Approval Workflow priority queue",
    "Action needed",
    "Approval Workflow exception list",
    "Governance Lead",
    "$0"
  ],
  [
    "executive-savings-report",
    "Executive Savings Report Records",
    "Executive Savings Report priority queue",
    "Open",
    "Executive Savings Report exception list",
    "Reporting Lead",
    "$0"
  ],
  [
    "documents",
    "Documents Records",
    "Documents priority queue",
    "Review",
    "Documents exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "notifications",
    "Notifications Records",
    "Notifications priority queue",
    "Action needed",
    "Notifications exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "integrations",
    "Integrations Records",
    "Integrations priority queue",
    "Open",
    "Integrations exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "profiles",
    "Profiles Records",
    "Profiles priority queue",
    "Review",
    "Profiles exception list",
    "Core Platform Lead",
    "$0"
  ],
  [
    "ai-assistant",
    "AI Assistant Records",
    "AI Assistant priority queue",
    "Action needed",
    "AI Assistant exception list",
    "Intelligence Layer Lead",
    "$0"
  ],
  [
    "ai-tools",
    "AI Tools Records",
    "AI Tools priority queue",
    "Open",
    "AI Tools exception list",
    "Intelligence Layer Lead",
    "$0"
  ]
] as const;

function buildSet(slug: string, title: string, firstName: string, firstStatus: string, secondName: string, owner: string, amount: string): FeatureEntitySet {
  return {
    title,
    columns: COLUMNS,
    rows: [
      { id: `${slug}-1`, name: firstName, status: firstStatus, owner, amount, dueDate: '2026-06-03', priority: 'High' },
      { id: `${slug}-2`, name: secondName, status: 'Review', owner: 'Operations', amount, dueDate: '2026-06-06', priority: 'Medium' },
      { id: `${slug}-3`, name: `${title.replace(' Records', '')} audit queue`, status: 'Queued', owner: 'Team Lead', amount: '$0', dueDate: '2026-06-10', priority: 'Medium' },
    ],
  };
}

export const featureEntitiesBySlug: Record<string, FeatureEntitySet> = Object.fromEntries(entitySeeds.map(([slug, title, firstName, firstStatus, secondName, owner, amount]) => [slug, buildSet(slug, title, firstName, firstStatus, secondName, owner, amount)]));
