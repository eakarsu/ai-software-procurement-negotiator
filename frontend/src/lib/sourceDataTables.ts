export type SourceDataColumn = {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue: string;
  sourceLine: string;
};

export type SourceDataTable = {
  id: string;
  sourceProject: string;
  name: string;
  displayName: string;
  framework: string;
  sourceFile: string;
  columns: SourceDataColumn[];
};

export const sourceDataTables: SourceDataTable[] = [
  {
    "id": "ai-software-procurement-negotiator-saas-inventory",
    "sourceProject": "Software Procurement Negotiator",
    "name": "saas_inventory",
    "displayName": "SaaS Inventory",
    "framework": "AppSchema",
    "sourceFile": "generated/saas-inventory.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Spend",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-usage-shelfware",
    "sourceProject": "Software Procurement Negotiator",
    "name": "usage_shelfware",
    "displayName": "Usage Shelfware",
    "framework": "AppSchema",
    "sourceFile": "generated/usage-shelfware.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Optimization",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-renewal-calendar",
    "sourceProject": "Software Procurement Negotiator",
    "name": "renewal_calendar",
    "displayName": "Renewal Calendar",
    "framework": "AppSchema",
    "sourceFile": "generated/renewal-calendar.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Renewals",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-benchmark-pricing",
    "sourceProject": "Software Procurement Negotiator",
    "name": "benchmark_pricing",
    "displayName": "Benchmark Pricing",
    "framework": "AppSchema",
    "sourceFile": "generated/benchmark-pricing.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Negotiation",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-negotiation-playbook",
    "sourceProject": "Software Procurement Negotiator",
    "name": "negotiation_playbook",
    "displayName": "Negotiation Playbook",
    "framework": "AppSchema",
    "sourceFile": "generated/negotiation-playbook.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Negotiation",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-security-review-queue",
    "sourceProject": "Software Procurement Negotiator",
    "name": "security_review_queue",
    "displayName": "Security Review Queue",
    "framework": "AppSchema",
    "sourceFile": "generated/security-review-queue.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Risk",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-budget-impact",
    "sourceProject": "Software Procurement Negotiator",
    "name": "budget_impact",
    "displayName": "Budget Impact",
    "framework": "AppSchema",
    "sourceFile": "generated/budget-impact.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Finance",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  },
  {
    "id": "ai-software-procurement-negotiator-vendor-scorecards",
    "sourceProject": "Software Procurement Negotiator",
    "name": "vendor_scorecards",
    "displayName": "Vendor Scorecards",
    "framework": "AppSchema",
    "sourceFile": "generated/vendor-scorecards.schema.ts",
    "columns": [
      {
        "name": "id",
        "type": "UUID",
        "nullable": false,
        "primaryKey": true,
        "unique": true,
        "defaultValue": "generated",
        "sourceLine": "id UUID PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "name TEXT NOT NULL"
      },
      {
        "name": "status",
        "type": "TEXT",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "open",
        "sourceLine": "status TEXT NOT NULL"
      },
      {
        "name": "owner",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "",
        "sourceLine": "owner TEXT"
      },
      {
        "name": "category",
        "type": "TEXT",
        "nullable": true,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "Vendor Management",
        "sourceLine": "category TEXT"
      },
      {
        "name": "updated_at",
        "type": "TIMESTAMP",
        "nullable": false,
        "primaryKey": false,
        "unique": false,
        "defaultValue": "now()",
        "sourceLine": "updated_at TIMESTAMP NOT NULL DEFAULT now()"
      }
    ]
  }
];
