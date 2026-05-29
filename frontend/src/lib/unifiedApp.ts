import {
  Activity,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  Database,
  FileText,
  Files,
  LayoutDashboard,
  PackageCheck,
  Plug,
  ShieldCheck,
  UserRound,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { label: string; href: string; icon: LucideIcon };
export type FeatureDefinition = { title: string; href: string; category: string; summary: string; bullets: string[] };
export type PageDefinition = {
  title: string;
  eyebrow: string;
  subtitle: string;
  category: string;
  summary: string;
  bullets: string[];
  metrics: Array<{ label: string; value: string; note: string }>;
};
export type FeatureContext = {
  sourceOwners: string[];
  operatingQueues: string[];
  outputs: string[];
  relatedRoutes: Array<{ label: string; href: string }>;
};

const suiteSourceOwners = ["SaaS contracts","Usage exports","Renewal notices","Benchmark data"];

const features = [
  {
    slug: "saas-inventory",
    title: "SaaS Inventory",
    href: "/saas-inventory",
    category: "Spend",
    icon: Bot,
    summary: "Products, owners, seats, contract value, renewal dates, and business criticality.",
    bullets: ["SaaS Inventory queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "SaaS Inventory", value: "24", note: 'Active records' },
      { label: 'Exceptions', value: "2", note: 'Need review' },
      { label: 'Due Soon', value: "4", note: 'Next 14 days' },
    ],
  },
  {
    slug: "usage-shelfware",
    title: "Usage Shelfware",
    href: "/usage-shelfware",
    category: "Optimization",
    icon: Workflow,
    summary: "Unused seats, low adoption, duplicate tools, inactive teams, and savings estimate.",
    bullets: ["Usage Shelfware queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Usage Shelfware", value: "33", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "5", note: 'Next 14 days' },
    ],
  },
  {
    slug: "renewal-calendar",
    title: "Renewal Calendar",
    href: "/renewal-calendar",
    category: "Renewals",
    icon: Users,
    summary: "Notice dates, renewal deadlines, owner actions, and negotiation windows.",
    bullets: ["Renewal Calendar queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Renewal Calendar", value: "42", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "6", note: 'Next 14 days' },
    ],
  },
  {
    slug: "benchmark-pricing",
    title: "Benchmark Pricing",
    href: "/benchmark-pricing",
    category: "Negotiation",
    icon: CalendarCheck,
    summary: "Price comparisons, discount bands, seat tiers, and leverage analysis.",
    bullets: ["Benchmark Pricing queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Benchmark Pricing", value: "51", note: 'Active records' },
      { label: 'Exceptions', value: "5", note: 'Need review' },
      { label: 'Due Soon', value: "7", note: 'Next 14 days' },
    ],
  },
  {
    slug: "negotiation-playbook",
    title: "Negotiation Playbook",
    href: "/negotiation-playbook",
    category: "Negotiation",
    icon: ClipboardList,
    summary: "Target concessions, fallback terms, procurement asks, and approval limits.",
    bullets: ["Negotiation Playbook queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Negotiation Playbook", value: "60", note: 'Active records' },
      { label: 'Exceptions', value: "6", note: 'Need review' },
      { label: 'Due Soon', value: "8", note: 'Next 14 days' },
    ],
  },
  {
    slug: "security-review-queue",
    title: "Security Review Queue",
    href: "/security-review-queue",
    category: "Risk",
    icon: FileText,
    summary: "Security questionnaires, SOC reports, risk flags, and approval status.",
    bullets: ["Security Review Queue queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Security Review Queue", value: "69", note: 'Active records' },
      { label: 'Exceptions', value: "2", note: 'Need review' },
      { label: 'Due Soon', value: "9", note: 'Next 14 days' },
    ],
  },
  {
    slug: "budget-impact",
    title: "Budget Impact",
    href: "/budget-impact",
    category: "Finance",
    icon: BarChart3,
    summary: "Spend forecast, increases, committed savings, department allocation, and budget variance.",
    bullets: ["Budget Impact queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Budget Impact", value: "78", note: 'Active records' },
      { label: 'Exceptions', value: "3", note: 'Need review' },
      { label: 'Due Soon', value: "4", note: 'Next 14 days' },
    ],
  },
  {
    slug: "vendor-scorecards",
    title: "Vendor Scorecards",
    href: "/vendor-scorecards",
    category: "Vendor Management",
    icon: PackageCheck,
    summary: "Service quality, adoption, support, roadmap fit, and renewal recommendation.",
    bullets: ["Vendor Scorecards queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Vendor Scorecards", value: "87", note: 'Active records' },
      { label: 'Exceptions', value: "4", note: 'Need review' },
      { label: 'Due Soon', value: "5", note: 'Next 14 days' },
    ],
  },
  {
    slug: "approval-workflow",
    title: "Approval Workflow",
    href: "/approval-workflow",
    category: "Governance",
    icon: ShieldCheck,
    summary: "Legal, security, finance, business owner approvals, and exception tracking.",
    bullets: ["Approval Workflow queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Approval Workflow", value: "96", note: 'Active records' },
      { label: 'Exceptions', value: "5", note: 'Need review' },
      { label: 'Due Soon', value: "6", note: 'Next 14 days' },
    ],
  },
  {
    slug: "executive-savings-report",
    title: "Executive Savings Report",
    href: "/executive-savings-report",
    category: "Reporting",
    icon: Activity,
    summary: "Savings pipeline, negotiated outcomes, risks, and next renewals.",
    bullets: ["Executive Savings Report queue","AI assisted review","Audit-ready output"],
    metrics: [
      { label: "Executive Savings Report", value: "105", note: 'Active records' },
      { label: 'Exceptions', value: "6", note: 'Need review' },
      { label: 'Due Soon', value: "7", note: 'Next 14 days' },
    ],
  },
  {
    slug: "documents",
    title: "Documents",
    href: "/documents",
    category: "Core Platform",
    icon: Files,
    summary: "Software Procurement Negotiator documents, evidence, attachments, and exports.",
    bullets: ["Documents","Controls","Audit trail"],
    metrics: [
      { label: "Documents", value: "48", note: 'Tracked' },
      { label: 'Open', value: "7", note: 'Needs review' },
      { label: 'Updated', value: "21", note: 'This week' },
    ],
  },
  {
    slug: "notifications",
    title: "Notifications",
    href: "/notifications",
    category: "Core Platform",
    icon: Bell,
    summary: "Software Procurement Negotiator alerts, reminders, exceptions, and approvals.",
    bullets: ["Notifications","Controls","Audit trail"],
    metrics: [
      { label: "Notifications", value: "65", note: 'Tracked' },
      { label: 'Open', value: "10", note: 'Needs review' },
      { label: 'Updated', value: "29", note: 'This week' },
    ],
  },
  {
    slug: "integrations",
    title: "Integrations",
    href: "/integrations",
    category: "Core Platform",
    icon: Plug,
    summary: "Software Procurement Negotiator connector health, sync status, and integration warnings.",
    bullets: ["Integrations","Controls","Audit trail"],
    metrics: [
      { label: "Integrations", value: "82", note: 'Tracked' },
      { label: 'Open', value: "13", note: 'Needs review' },
      { label: 'Updated', value: "37", note: 'This week' },
    ],
  },
  {
    slug: "profiles",
    title: "Profiles",
    href: "/profiles",
    category: "Core Platform",
    icon: UserRound,
    summary: "Software Procurement Negotiator users, roles, teams, permissions, and ownership settings.",
    bullets: ["Profiles","Controls","Audit trail"],
    metrics: [
      { label: "Profiles", value: "99", note: 'Tracked' },
      { label: 'Open', value: "16", note: 'Needs review' },
      { label: 'Updated', value: "45", note: 'This week' },
    ],
  },
] as const;

const aiFeatures = [
  {
    slug: 'ai-assistant',
    title: 'AI Assistant',
    href: '/features/ai-assistant',
    category: 'Intelligence Layer',
    icon: Bot,
    summary: "Software Procurement Negotiator assistant for triage, drafting, analysis, recommendations, and operational review.",
    bullets: ['Triage support', 'Drafting', 'Review guidance'],
    metrics: [
      { label: 'Sessions', value: '128', note: 'Last 24 hours' },
      { label: 'Drafts', value: '204', note: 'Generated' },
      { label: 'Escalations', value: '14', note: 'Expert review' },
    ],
  },
  {
    slug: 'ai-tools',
    title: 'AI Tools',
    href: '/features/ai-tools',
    category: 'Intelligence Layer',
    icon: Activity,
    summary: "Software Procurement Negotiator AI tools for scoring, generation, extraction, classification, exception review, and reporting.",
    bullets: ['Scoring', 'Classification', 'Exception review'],
    metrics: [
      { label: 'Runs', value: '318', note: 'Last 24 hours' },
      { label: 'Signals', value: '88', note: 'New alerts' },
      { label: 'Accepted', value: '117', note: 'Reviewer accepted' },
    ],
  },
] as const;

const allFeatures = [...features, ...aiFeatures];

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'All Features', href: '/features', icon: Blocks },
  { label: 'Documents', href: '/documents', icon: Files },
  { label: 'Source Tables', href: '/source-tables', icon: Database },
  { label: 'Profiles', href: '/profiles', icon: UserRound },
];

export const featureNav: NavItem[] = allFeatures.map((feature) => ({ label: feature.title, href: feature.href, icon: feature.icon }));
export const featureCatalog: FeatureDefinition[] = allFeatures.map((feature) => ({ title: feature.title, href: feature.href, category: feature.category, summary: feature.summary, bullets: [...feature.bullets] }));

export const featureFamilies = [
  {
    "name": "Spend",
    "features": [
      "SaaS Inventory"
    ]
  },
  {
    "name": "Optimization",
    "features": [
      "Usage Shelfware"
    ]
  },
  {
    "name": "Renewals",
    "features": [
      "Renewal Calendar"
    ]
  },
  {
    "name": "Negotiation",
    "features": [
      "Benchmark Pricing",
      "Negotiation Playbook"
    ]
  },
  {
    "name": "Risk",
    "features": [
      "Security Review Queue"
    ]
  },
  {
    "name": "Finance",
    "features": [
      "Budget Impact"
    ]
  },
  {
    "name": "Vendor Management",
    "features": [
      "Vendor Scorecards"
    ]
  },
  {
    "name": "Governance",
    "features": [
      "Approval Workflow"
    ]
  },
  {
    "name": "Reporting",
    "features": [
      "Executive Savings Report"
    ]
  },
  {
    "name": "Core Platform",
    "features": [
      "Documents",
      "Notifications",
      "Integrations",
      "Profiles"
    ]
  },
  {
    "name": "Intelligence Layer",
    "features": [
      "AI Assistant",
      "AI Tools"
    ]
  }
];

function toPage(feature: (typeof allFeatures)[number]): PageDefinition {
  return {
    title: feature.title,
    eyebrow: feature.category,
    subtitle: feature.summary,
    category: feature.category,
    summary: feature.title + ' is implemented as a dedicated Software Procurement Negotiator workflow with records, AI assistance, approvals, audit, and reporting.',
    bullets: [...feature.bullets],
    metrics: [...feature.metrics],
  };
}

export const pageRegistry: Record<string, PageDefinition> = Object.fromEntries(features.map((feature) => [feature.slug, toPage(feature)]));
export const aiFeatureRegistry: Record<string, PageDefinition> = Object.fromEntries(aiFeatures.map((feature) => [feature.slug, toPage(feature)]));
export const featureContexts: Record<string, FeatureContext> = Object.fromEntries(
  allFeatures.map((feature) => [
    feature.title,
    {
      sourceOwners: suiteSourceOwners,
      operatingQueues: [feature.title + ' records', feature.title + ' approvals', feature.title + ' exceptions'],
      outputs: [feature.title + ' dashboard', feature.title + ' export', feature.title + ' audit trail'],
      relatedRoutes: [{ label: 'Dashboard', href: '/dashboard' }, { label: 'All Features', href: '/features' }, { label: 'AI Tools', href: '/features/ai-tools' }],
    },
  ]),
);
