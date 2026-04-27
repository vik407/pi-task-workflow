---
description: Create Phase 2 implementation plan for a task workspace
argument-hint: "<TASK-ID>"
---

Create Phase 2 implementation plan for task `$1`.

Use `tasks/$1/` as the task context.

## Prerequisites

- `tasks/$1/analysis.md` must exist and be complete.
- If analysis is missing or weak, stop and recommend `/task-analyze $1`.

## Warm-up

Read first:

1. `AGENTS.md`
2. `README.md`
3. `docs/task-workflow.md`
4. `tasks/lessons.md` if present
5. `.pi/workflow/tasks/knowledge/project-patterns.md` if present
6. `tasks/$1/analysis.md`
7. Relevant project files referenced by analysis.

## Planning process

1. Build only on evidence from `analysis.md`.
2. Reuse known project patterns before inspecting or rediscovering stable architecture facts.
3. Inspect existing implementation patterns before designing new ones.
3. Prefer the simplest solution that fully addresses the root cause.
4. Create phases with validation checkpoints.
5. Include test additions, coverage improvements, or environment-specific manual validation based on `analysis.md` orchestration findings.
6. Include rollback notes.
7. For `COMPLEX` tasks, ask: is there a simpler architecture?
7. If new reusable project patterns are discovered, note them for `.pi/workflow/tasks/knowledge/project-patterns.md`.

## Write `tasks/$1/plan.md`

Use this structure:

```markdown
# Plan: $1

## Solution Overview

- **Approach**:
- **Alignment Rationale**:

## Solution Architecture

- **Design Approach**:
- **Integration Strategy**:

## Implementation Phases

### Phase 1: [Name]

- **Objectives**:
- **Technical Tasks**:
- **Validation**:

## Quality Assurance

- **Testing Strategy**: include existing test orchestration and any new tests to add.
- **Environment Validation Plan**: local, development, staging, production, logs, and manual checks as applicable.
- **Coverage Plan**: files, paths, or scenarios requiring additional coverage.
- **Success Criteria**:
- **Risk Mitigation**:
- **Rollback Plan**:

## Signals

Only include categories supported by evidence.

- **Cross-repo**:
- **External dependency**:
- **Design decision**:
- **Blocker risk**:
- **Developer input needed**:

## Implementation Checklist

- [ ] [Phase 1 - Step]: Specific deliverable
- [ ] [Phase 1 - Validation]: Verification step
- [ ] Final integration validation
```

## Phase gate

Planning is complete only when:

- The plan addresses the analysis findings.
- Phases have validation checkpoints.
- Success criteria are testable.
- Rollback is documented.

## Gate check

After writing the plan, run:

```bash
node .pi/workflow/scripts/task-gate.mjs $1 plan
```

## Model suggestion

After the plan gate passes, suggest the model class for implementation:

- `COMPLEX`, multi-component, risky, or ambiguous work → recommend high-reasoning model.
- `SIMPLE`, bounded, low-risk, clear checklist → standard model may be acceptable.
- `GUIDED` mode is preferred when uncertainty remains.

Do not switch models automatically. The developer decides.

## Restrictions

- No code changes during planning.
- No writable git decisions.

Keep the final response short and practical.
