# Task Workflow

This repository supports a Scrum/Kanban-style task workflow.

Each task is identified by a project-management code such as `ABC-0123`. The task code must match:

```text
^[A-Z]+-[0-9]+$
```

## Task workspace

Each task gets its own folder:

```text
tasks/ABC-0123/
├── README.md                 # Task summary and source ticket details
├── analysis.md               # Root analysis and discovery artifact
├── analysis/                 # Optional parallel/domain analysis findings
├── plan.md                   # Implementation plan and checklist
├── implementation.md         # Implementation notes and changed files
├── validation.md             # Validation commands and results
├── validation/               # Optional parallel/domain validation findings
├── context/                  # Supporting notes, screenshots, logs, specs
└── debugging/                # Reproduction scripts, traces, temporary investigation notes
```

Root files are the source of truth. Optional folders hold parallel or domain-specific findings only when they are useful.

## Lifecycle

1. Analysis and discovery
2. Planning
3. Implementation
4. Validation

## Commands

Create and inspect task folders with:

```bash
npm run task:init -- ABC-0123 "Short task title"
npm run task:validate -- ABC-0123
npm run task:status -- ABC-0123
npm run task:update -- ABC-0123 "What changed"
npm run task:gate -- ABC-0123 analysis
npm run task:archive -- ABC-0123
```

## Pi prompts

Use these prompt templates inside Pi:

```text
/task-init ABC-0123 Short task title
/task-analyze ABC-0123
/task-plan ABC-0123
/task-implement ABC-0123 AUTO
/task-implement ABC-0123 GUIDED
/task-update ABC-0123 What changed
/task-gate ABC-0123 analysis
/task-validate ABC-0123
/task-pr ABC-0123
/task-archive ABC-0123
/task-status ABC-0123
```

## Multi-agent orchestration

Use `docs/multi-agent-orchestration.md`.

Current workflow simulates phase-specific agents with prompts and task artifacts. True isolated multi-agent orchestration is kept as a future Pi extension until the official Pi documentation exposes a stable, appropriate pattern.

## Lessons and patterns

Shared memory lives in:

```text
tasks/lessons.md
tasks/knowledge/project-patterns.md
```

Use `tasks/lessons.md` for durable developer corrections. Use `tasks/knowledge/project-patterns.md` for reusable patterns discovered during analysis, planning, or implementation.

Do not rediscover stable facts on every task. If the project stack is already known, reuse it. Record only useful, stable patterns:

- stack and framework
- database and services
- project commands
- validation paths
- architecture conventions
- environment details

Commands:

```bash
npm run patterns:list -- PROJECT-KEY
npm run patterns:add -- PROJECT-KEY "Node + Angular + PostgreSQL; tests run with npm test"
```

Do not overdo it. Learn once. Reuse often. Update when evidence changes.

## Model policy

Use `docs/model-policy.md`.

High-reasoning models are expected for analysis, planning, complex implementation, and significant delta updates. Standard models are acceptable for status, formatting, PR drafts, and validation summaries when command output is real.

## Phase gates

Use gates before advancing phases:

```bash
npm run task:gate -- ABC-0123 analysis
npm run task:gate -- ABC-0123 plan
npm run task:gate -- ABC-0123 implementation
npm run task:gate -- ABC-0123 validation
```

Gates check structure and evidence markers. They do not prove truth.

When truth cannot be fully proven from repository evidence, analysis must record:

- `Test and Environment Orchestration`: detected package scripts, frameworks, CI jobs, coverage tools, e2e tools, local development, development environment, staging, production, logs, observability, and existing test locations.
- `Validation Requests`: terminal commands, console checks, logs, reproduction steps, environment checks, or manual checks.
- `Open Questions`: questions for the developer, product owner, another engineer, or an external dependency owner.

If a test framework exists, the plan should include additional tests or coverage when needed. If CI is absent or insufficient, the plan should define environment-specific validation. Manual checks are acceptable when automated validation is unavailable or insufficient, and the reason must be recorded.

See `docs/environment-validation.md`.

## Fixtures

Workflow hardening uses two fixture levels:

```bash
npm run test:fixture
npm run test:fixture:project
```

The first validates workflow mechanics with a disposable task. The second validates a real sample Node.js project with executable source code, tests, and task artifacts under `fixtures/sample-node-project/`.

The developer may manually close a gate after accepting the risk:

```bash
npm run task:gate:close -- ABC-0123 analysis "accepted after team confirmation"
```

Manual closures are recorded in `tasks/<TASK-ID>/gate-decisions.md`.

## Archive decisions

Archive is a developer decision.

The validation gate should be checked before archive when practical, but the archive script does not block on validation. Archive may represent completion, external handoff, project manager decision, backlog return, cancellation, or accepted risk.

The assistant may report validation status and recommend caution. The developer decides.

## Signals

During analysis and planning, record signals. Signals inform the developer. They do not create automatic gates.

- Cross-repo
- External dependency
- Design decision
- Blocker risk
- Developer input needed

## Complexity

Classify each task objectively.

- `SIMPLE`: small scope, existing pattern, low risk, few files.
- `COMPLEX`: multiple components, cross-service work, unclear pattern, security/auth/migration/performance risk, or broad file impact.

When uncertain, classify as `COMPLEX`. A cautious plan is cheaper than a careless incident.

## Git safety

The assistant may suggest commands, commit messages, and PR descriptions. The developer owns final writable git decisions.

Do not automatically merge, pull, rebase, reset, commit, tag, push, or run destructive checkout/switch commands unless explicitly requested.
