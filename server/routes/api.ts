import type { Express, Request, Response } from "express";
import { Router } from "express";
import { nanoid } from "nanoid";
import { sdk } from "../_core/sdk";

const DEMO_USER = {
  id: 1,
  openId: "demo-finpay-user",
  name: "FinPay Demo User",
  email: "demo@finpay.local",
  loginMethod: "demo",
  role: "admin",
};

const now = new Date();

const employees = [
  {
    id: 1,
    name: "Maya Chen",
    role: "Senior Platform Engineer",
    team: "Payments",
    email: "maya.chen@finpay.local",
  },
  {
    id: 2,
    name: "Arjun Rao",
    role: "Backend Engineer",
    team: "Payments",
    email: "arjun.rao@finpay.local",
  },
  {
    id: 3,
    name: "Priya Shah",
    role: "SRE Lead",
    team: "Infrastructure",
    email: "priya.shah@finpay.local",
  },
  {
    id: 4,
    name: "Daniel Kim",
    role: "Product Manager",
    team: "FinPay",
    email: "daniel.kim@finpay.local",
  },
];

const projects = [
  {
    id: 1,
    name: "Payment API",
    description: "Core payment processing platform",
    status: "active",
    owner: "Maya Chen",
  },
  {
    id: 2,
    name: "Legacy Authentication",
    description: "Historical authentication dependency",
    status: "maintenance",
    owner: "Arjun Rao",
  },
  {
    id: 3,
    name: "Settlement Pipeline",
    description: "Daily payment settlement workflow",
    status: "active",
    owner: "Priya Shah",
  },
];

const events = [
  {
    id: 1,
    eventType: "deployment",
    component: "Payment API",
    title: "Payment API deployment completed",
    description: "Production deployment completed successfully.",
    severity: "low",
    status: "completed",
    actor: "Maya Chen",
    createdAt: new Date(now.getTime() - 15 * 60 * 1000),
  },
  {
    id: 2,
    eventType: "incident",
    component: "Legacy Authentication",
    title: "Authentication latency detected",
    description: "Elevated latency was detected in the legacy authentication path.",
    severity: "high",
    status: "active",
    actor: "Priya Shah",
    createdAt: new Date(now.getTime() - 42 * 60 * 1000),
  },
  {
    id: 3,
    eventType: "handoff",
    component: "Settlement Pipeline",
    title: "Settlement ownership changed",
    description: "Settlement pipeline knowledge transferred to the infrastructure team.",
    severity: "medium",
    status: "active",
    actor: "Daniel Kim",
    createdAt: new Date(now.getTime() - 90 * 60 * 1000),
  },
  {
    id: 4,
    eventType: "memory",
    component: "Payment API",
    title: "Historical memory updated",
    description: "A previous production failure pattern was linked to the current system.",
    severity: "low",
    status: "completed",
    actor: "Maya Chen",
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
  },
];

const memories = [
  {
    id: 1,
    title: "Legacy Authentication dependency",
    category: "architecture",
    summary:
      "Payment API historically depended on the legacy authentication service.",
    detail:
      "Previous migrations showed that removing the dependency without updating token validation caused authentication failures.",
    confidence: 0.94,
    source: "Historical incident records",
    owner: "Maya Chen",
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Settlement retry behavior",
    category: "operations",
    summary:
      "Settlement jobs should use controlled retries rather than immediate repeated execution.",
    detail:
      "Historical operational knowledge recommends checking downstream settlement state before retrying.",
    confidence: 0.91,
    source: "Operational memory",
    owner: "Priya Shah",
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Payment API deployment sequence",
    category: "deployment",
    summary:
      "Authentication compatibility should be verified before payment deployment.",
    detail:
      "The deployment sequence exists because an earlier release caused a temporary authentication mismatch.",
    confidence: 0.88,
    source: "Failure fingerprint #FP-184",
    owner: "Arjun Rao",
    createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
  },
];

const incidents = [
  {
    id: 184,
    title: "Legacy authentication mismatch",
    severity: "high",
    status: "resolved",
    component: "Legacy Authentication",
    summary:
      "A deployment introduced a mismatch between the payment API and legacy authentication tokens.",
    lesson:
      "Verify authentication compatibility before changing payment infrastructure.",
    occurredAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 177,
    title: "Settlement retry storm",
    severity: "medium",
    status: "resolved",
    component: "Settlement Pipeline",
    summary:
      "Repeated settlement retries created unnecessary downstream traffic.",
    lesson:
      "Check settlement state before retrying an operation.",
    occurredAt: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000),
  },
];

const fingerprints = [
  {
    id: 1,
    fingerprintId: "FP-184",
    name: "Authentication compatibility regression",
    severity: "high",
    occurrences: 3,
    confidence: 0.94,
    description:
      "Deployments involving authentication changes have historically correlated with payment failures.",
    recommendation:
      "Verify legacy authentication compatibility before deployment.",
  },
  {
    id: 2,
    fingerprintId: "FP-177",
    name: "Repeated settlement retries",
    severity: "medium",
    occurrences: 2,
    confidence: 0.89,
    description:
      "Repeated retries can amplify settlement traffic when downstream state is unknown.",
    recommendation:
      "Inspect settlement state before retrying.",
  },
];

const knowledgeGaps = [
  {
    id: 1,
    title: "Legacy Authentication ownership",
    area: "Authentication",
    severity: "high",
    description:
      "Current ownership of the legacy authentication dependency is unclear.",
    impact:
      "A future migration could modify the service without understanding historical constraints.",
    status: "open",
  },
  {
    id: 2,
    title: "Settlement fallback procedure",
    area: "Settlement",
    severity: "medium",
    description:
      "The organization lacks a clearly documented fallback procedure.",
    impact:
      "Incident response may depend on individual knowledge.",
    status: "open",
  },
  {
    id: 3,
    title: "Historical deployment rationale",
    area: "Deployment",
    severity: "low",
    description:
      "Some historical deployment decisions have incomplete documentation.",
    impact:
      "Future engineers may repeat previous experiments.",
    status: "open",
  },
];

const conflicts = [
  {
    id: 1,
    topic: "Authentication ownership",
    status: "unresolved",
    severity: "high",
    sources: [
      "Current team documentation",
      "Historical organizational memory",
    ],
    description:
      "Current documentation and historical memory disagree about ownership.",
  },
  {
    id: 2,
    topic: "Settlement retry policy",
    status: "review",
    severity: "medium",
    sources: [
      "Operations handbook",
      "Incident history",
    ],
    description:
      "The documented retry policy does not completely match historical incident behavior.",
  },
];

const warnings = [
  {
    id: 1,
    title: "Historical authentication dependency detected",
    severity: "high",
    status: "active",
    component: "Payment API",
    message:
      "A planned change touches an area with a known historical failure pattern.",
    recommendation:
      "Review Failure Fingerprint FP-184 before proceeding.",
    createdAt: new Date(now.getTime() - 12 * 60 * 1000),
  },
  {
    id: 2,
    title: "Knowledge gap detected",
    severity: "medium",
    status: "active",
    component: "Settlement Pipeline",
    message:
      "The current owner may not have complete historical settlement knowledge.",
    recommendation:
      "Review the organizational memory and assign a documented owner.",
    createdAt: new Date(now.getTime() - 55 * 60 * 1000),
  },
  {
    id: 3,
    title: "Conflicting operational guidance",
    severity: "medium",
    status: "active",
    component: "Operations",
    message:
      "Two knowledge sources provide different retry guidance.",
    recommendation:
      "Resolve the knowledge conflict before changing retry behavior.",
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
];

const knowledgePatterns = [
  {
    id: 1,
    name: "Authentication compatibility regression",
    confidence: 94,
    occurrences: 3,
    status: "active",
  },
  {
    id: 2,
    name: "Settlement retry amplification",
    confidence: 89,
    occurrences: 2,
    status: "active",
  },
  {
    id: 3,
    name: "Undocumented ownership dependency",
    confidence: 82,
    occurrences: 2,
    status: "observed",
  },
];

const organizationSettings = {
  organizationName: "FinPay",
  agentEnabled: true,
  proactiveWarnings: true,
  learningEnabled: true,
  warningThreshold: "medium",
};

const handoffSessions: any[] = [];

function demoUser() {
  return { ...DEMO_USER };
}

async function requireUser(req: Request, res: Response) {
  if (process.env.DEMO_MODE === "true") {
    return demoUser();
  }

  try {
    const user = await sdk.authenticateRequest(req);

    if (!user) {
      res.status(401).json({
        error: "Authentication required",
        code: "UNAUTHORIZED",
      });
      return null;
    }

    return user;
  } catch {
    res.status(401).json({
      error: "Authentication required",
      code: "UNAUTHORIZED",
    });
    return null;
  }
}

function asyncRoute(
  handler: (
    req: Request,
    res: Response,
    user: ReturnType<typeof demoUser>
  ) => Promise<void> | void
) {
  return async (req: Request, res: Response) => {
    res.set("Cache-Control", "private, no-store");

    const user = await requireUser(req, res);

    if (!user) {
      return;
    }

    try {
      await handler(req, res, user as ReturnType<typeof demoUser>);
    } catch (error) {
      console.error("[HandoffOS API]", error);

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error",
      });
    }
  };
}

function jsonBody(req: Request) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

export function registerHandoffRoutes(app: Express) {
  const api = Router();

  // ---------------------------------------------------------
  // OVERVIEW
  // ---------------------------------------------------------

  api.get(
    "/overview",
    asyncRoute(async (_req, res) => {
      const activeWarnings = warnings.filter(
        warning => warning.status === "active"
      );

      const activeEvents = events.filter(
        event => event.status === "active"
      );

      res.json({
        organization: "FinPay",

        stats: {
          employees: employees.length,
          projects: projects.length,
          memories: memories.length,
          incidents: incidents.length,
          activeWarnings: activeWarnings.length,
          knowledgeGaps: knowledgeGaps.length,
          conflicts: conflicts.length,
          failureFingerprints: fingerprints.length,
        },

        summary: {
          memoryCount: memories.length,
          activeWarningCount: activeWarnings.length,
          knowledgeGapCount: knowledgeGaps.length,
          conflictCount: conflicts.length,
          fingerprintCount: fingerprints.length,
          recentActivityCount: activeEvents.length,
        },

        currentOperation:
          activeEvents.length > 0
            ? `Analyzing ${activeEvents[0].eventType.replace(/_/g, " ")} · ${activeEvents[0].component}`
            : "Monitoring FinPay organizational memory",

        latestEvent: events[0] ?? null,

        warnings: activeWarnings.slice(0, 5),

        recentActivity: events.slice(0, 8),

        knowledgeHealth: {
          score: 87,
          memoryCoverage: 91,
          ownershipCoverage: 78,
          documentationCoverage: 84,
          conflictRate: 12,
        },
      });
    })
  );

  // ---------------------------------------------------------
  // ACTIVITY
  // ---------------------------------------------------------

  api.get(
    "/events",
    asyncRoute(async (req, res) => {
      const limit = Number(req.query.limit ?? 50);

      res.json({
        events: events.slice(0, Math.max(1, Math.min(limit, 100))),
        total: events.length,
      });
    })
  );

  api.get(
    "/activity",
    asyncRoute(async (_req, res) => {
      res.json({
        events,
        total: events.length,
      });
    })
  );

  // ---------------------------------------------------------
  // MEMORY
  // ---------------------------------------------------------

  api.get(
    "/memories",
    asyncRoute(async (req, res) => {
      const search = String(req.query.search ?? "")
        .trim()
        .toLowerCase();

      const filtered = search
        ? memories.filter(memory =>
            `${memory.title} ${memory.category} ${memory.summary} ${memory.detail}`
              .toLowerCase()
              .includes(search)
          )
        : memories;

      res.json({
        memories: filtered,
        total: filtered.length,
      });
    })
  );

  api.get(
    "/memory",
    asyncRoute(async (req, res) => {
      const search = String(req.query.search ?? "")
        .trim()
        .toLowerCase();

      const filtered = search
        ? memories.filter(memory =>
            `${memory.title} ${memory.summary} ${memory.detail}`
              .toLowerCase()
              .includes(search)
          )
        : memories;

      res.json({
        memories: filtered,
        total: filtered.length,
      });
    })
  );

  api.post(
    "/memories",
    asyncRoute(async (req, res) => {
      const body = jsonBody(req);

      const memory = {
        id: memories.length + 1,
        title: body.title ?? "New organizational memory",
        category: body.category ?? "general",
        summary: body.summary ?? "",
        detail: body.detail ?? body.description ?? "",
        confidence: Number(body.confidence ?? 0.8),
        source: body.source ?? "Demo entry",
        owner: body.owner ?? DEMO_USER.name,
        createdAt: new Date(),
      };

      memories.unshift(memory);

      res.status(201).json(memory);
    })
  );

  // ---------------------------------------------------------
  // INCIDENTS
  // ---------------------------------------------------------

  api.get(
    "/incidents",
    asyncRoute(async (_req, res) => {
      res.json({
        incidents,
        total: incidents.length,
      });
    })
  );

  // ---------------------------------------------------------
  // FAILURE FINGERPRINTS
  // ---------------------------------------------------------

  api.get(
    "/fingerprints",
    asyncRoute(async (_req, res) => {
      res.json({
        fingerprints,
        total: fingerprints.length,
      });
    })
  );

  api.get(
    "/failure-fingerprints",
    asyncRoute(async (_req, res) => {
      res.json({
        fingerprints,
        total: fingerprints.length,
      });
    })
  );

  // ---------------------------------------------------------
  // KNOWLEDGE SHADOW
  // ---------------------------------------------------------

  api.get(
    "/knowledge-shadow",
    asyncRoute(async (_req, res) => {
      res.json({
        employees: employees.map(employee => ({
          ...employee,
          knowledgeScore:
            employee.id === 1
              ? 94
              : employee.id === 2
                ? 86
                : employee.id === 3
                  ? 91
                  : 72,
          criticalKnowledge:
            employee.id === 1
              ? [
                  "Payment API",
                  "Legacy Authentication",
                  "Deployment compatibility",
                ]
              : employee.id === 3
                ? ["Settlement Pipeline", "Incident response"]
                : ["Team operations"],
        })),

        knowledgeDistribution: [
          {
            name: "Maya Chen",
            value: 94,
          },
          {
            name: "Priya Shah",
            value: 91,
          },
          {
            name: "Arjun Rao",
            value: 86,
          },
          {
            name: "Daniel Kim",
            value: 72,
          },
        ],

        summary: {
          totalExperts: 4,
          highRiskKnowledgeAreas: 2,
          undocumentedAreas: 3,
        },
      });
    })
  );

  // ---------------------------------------------------------
  // KNOWLEDGE GAPS
  // ---------------------------------------------------------

  api.get(
    "/gaps",
    asyncRoute(async (_req, res) => {
      res.json({
        gaps: knowledgeGaps,
        total: knowledgeGaps.length,
      });
    })
  );

  api.get(
    "/knowledge-gaps",
    asyncRoute(async (_req, res) => {
      res.json({
        gaps: knowledgeGaps,
        total: knowledgeGaps.length,
      });
    })
  );

  // ---------------------------------------------------------
  // CONFLICTS
  // ---------------------------------------------------------

  api.get(
    "/conflicts",
    asyncRoute(async (_req, res) => {
      res.json({
        conflicts,
        total: conflicts.length,
      });
    })
  );

  // ---------------------------------------------------------
  // TIMELINE
  // ---------------------------------------------------------

  api.get(
    "/timeline",
    asyncRoute(async (_req, res) => {
      const timeline = [
        {
          id: "t1",
          date: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000),
          type: "incident",
          title: "Settlement retry storm",
          description:
            "Historical settlement retry incident recorded.",
          severity: "medium",
        },
        {
          id: "t2",
          date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          type: "incident",
          title: "Legacy authentication mismatch",
          description:
            "Historical authentication compatibility incident recorded.",
          severity: "high",
        },
        {
          id: "t3",
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          type: "memory",
          title: "Historical deployment knowledge linked",
          description:
            "A previous failure pattern was linked to organizational memory.",
          severity: "low",
        },
        {
          id: "t4",
          date: now,
          type: "warning",
          title: "Proactive warning generated",
          description:
            "Current activity matches a known organizational pattern.",
          severity: "high",
        },
      ];

      res.json({
        timeline,
      });
    })
  );

  // ---------------------------------------------------------
  // KNOWLEDGE GRAPH
  // ---------------------------------------------------------

  api.get(
    "/graph",
    asyncRoute(async (_req, res) => {
      res.json({
        nodes: [
          {
            id: "maya",
            label: "Maya",
            type: "employee",
            x: "10%",
            y: "35%",
          },
          {
            id: "payment-api",
            label: "Payment API",
            type: "project",
            x: "70%",
            y: "13%",
          },
          {
            id: "client-abc",
            label: "Client ABC",
            type: "client",
            x: "78%",
            y: "65%",
          },
          {
            id: "incident-184",
            label: "Incident #184",
            type: "incident",
            x: "22%",
            y: "80%",
          },
        ],

        edges: [
          {
            source: "maya",
            target: "payment-api",
            relationship: "owns",
          },
          {
            source: "payment-api",
            target: "incident-184",
            relationship: "affected-by",
          },
          {
            source: "maya",
            target: "incident-184",
            relationship: "responded-to",
          },
          {
            source: "payment-api",
            target: "client-abc",
            relationship: "serves",
          },
        ],
      });
    })
  );

  // ---------------------------------------------------------
  // WARNINGS
  // ---------------------------------------------------------

  api.get(
    "/warnings",
    asyncRoute(async (_req, res) => {
      res.json({
        warnings,
        total: warnings.length,
        active: warnings.filter(warning => warning.status === "active")
          .length,
      });
    })
  );

  api.post(
    "/warnings/:id/action",
    asyncRoute(async (req, res) => {
      const id = Number(req.params.id);
      const body = jsonBody(req);

      const warning = warnings.find(item => item.id === id);

      if (!warning) {
        res.status(404).json({
          error: "Warning not found",
        });
        return;
      }

      if (
        body.action === "dismiss" ||
        body.action === "resolve" ||
        body.action === "acknowledge"
      ) {
        warning.status =
          body.action === "dismiss" ? "dismissed" : "resolved";
      }

      res.json({
        success: true,
        warning,
      });
    })
  );

  // ---------------------------------------------------------
  // HANDOFF SIMULATOR
  // ---------------------------------------------------------

  api.get(
    "/handoff",
    asyncRoute(async (_req, res) => {
      res.json({
        sessions: handoffSessions,
        employees,
        projects,
      });
    })
  );

  api.post(
    "/handoff",
    asyncRoute(async (req, res) => {
      const body = jsonBody(req);

      const sourceEmployee =
        employees.find(employee => employee.id === Number(body.fromEmployeeId)) ??
        employees[0];

      const targetEmployee =
        employees.find(employee => employee.id === Number(body.toEmployeeId)) ??
        employees[1];

      const session = {
        id: `handoff_${nanoid(8)}`,
        fromEmployee: sourceEmployee,
        toEmployee: targetEmployee,
        project:
          projects.find(project => project.id === Number(body.projectId)) ??
          projects[0],
        createdAt: new Date(),
        riskScore: 28,
        knowledgeCoverage: 84,
        warnings: warnings.slice(0, 2),
        missingKnowledge: knowledgeGaps.slice(0, 2),
        recommendedMemories: memories.slice(0, 3),
      };

      handoffSessions.unshift(session);

      res.status(201).json(session);
    })
  );

  api.post(
    "/handoff/test",
    asyncRoute(async (req, res) => {
      const body = jsonBody(req);

      const score =
        body.includeHistoricalMemory === false
          ? 61
          : body.includeHistoricalMemory === true
            ? 91
            : 84;

      res.json({
        success: true,
        score,
        readiness:
          score >= 85
            ? "ready"
            : score >= 70
              ? "needs_review"
              : "high_risk",
        missingKnowledge:
          score < 85 ? knowledgeGaps.slice(0, 2) : knowledgeGaps.slice(0, 1),
        historicalContext: memories.slice(0, 3),
        warnings: warnings.slice(0, 2),
        explanation:
          "The simulator compares the incoming owner's known context with organizational memory and historical failure patterns.",
      });
    })
  );

  // ---------------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------------

  api.get(
    "/settings",
    asyncRoute(async (_req, res) => {
      res.json(organizationSettings);
    })
  );

  api.put(
    "/settings",
    asyncRoute(async (req, res) => {
      const body = jsonBody(req);

      Object.assign(organizationSettings, {
        ...body,
      });

      res.json({
        success: true,
        settings: organizationSettings,
      });
    })
  );

  api.patch(
    "/settings",
    asyncRoute(async (req, res) => {
      const body = jsonBody(req);

      Object.assign(organizationSettings, {
        ...body,
      });

      res.json({
        success: true,
        settings: organizationSettings,
      });
    })
  );

  // ---------------------------------------------------------
  // EMPLOYEES / PROJECTS
  // ---------------------------------------------------------

  api.get(
    "/employees",
    asyncRoute(async (_req, res) => {
      res.json({
        employees,
        total: employees.length,
      });
    })
  );

  api.get(
    "/projects",
    asyncRoute(async (_req, res) => {
      res.json({
        projects,
        total: projects.length,
      });
    })
  );

  // ---------------------------------------------------------
  // KNOWLEDGE PATTERNS
  // ---------------------------------------------------------

  api.get(
    "/patterns",
    asyncRoute(async (_req, res) => {
      res.json({
        patterns: knowledgePatterns,
        total: knowledgePatterns.length,
      });
    })
  );

  api.get(
    "/knowledge-patterns",
    asyncRoute(async (_req, res) => {
      res.json({
        patterns: knowledgePatterns,
        total: knowledgePatterns.length,
      });
    })
  );

  // ---------------------------------------------------------
  // CURRENT USER
  // ---------------------------------------------------------

  api.get(
    "/me",
    asyncRoute(async (_req, res, user) => {
      res.json(user);
    })
  );

  // ---------------------------------------------------------
  // HEALTH
  // ---------------------------------------------------------

  api.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "HandoffOS",
      mode: process.env.DEMO_MODE === "true" ? "demo" : "production",
      database: "demo-memory",
      timestamp: new Date().toISOString(),
    });
  });

  // ---------------------------------------------------------
  // REGISTER ROUTES
  // ---------------------------------------------------------

  app.use("/api", api);
}