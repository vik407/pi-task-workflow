---
description: Complete Phase 1 analysis and discovery for a task workspace
argument-hint: "<TASK-ID>"
---

Complete Phase 1 analysis for task `$1`.

Use `tasks/$1/` as the task context.

## Warm-up

Read first:

1. `AGENTS.md`
2. `README.md`
3. `docs/task-workflow.md`
4. `tasks/lessons.md` if present
5. `tasks/knowledge/project-patterns.md` if present
6. `tasks/$1/README.md`
7. Existing files under `tasks/$1/context/` if present

## Investigation process

1. Understand symptoms, requirements, acceptance criteria, and user intent.
2. Reuse known project patterns from `tasks/knowledge/project-patterns.md` before rediscovering stable facts.
3. Discover the actual stack from project files only when unknown, changed, or relevant to the task. Do not assume.
4. Detect the test and environment orchestration available in the project only when unknown, changed, or relevant: package scripts, test framework, CI config, coverage tooling, e2e tools, local development, dev environment, staging, production, logs, monitoring, and existing test locations.
4. Read relevant files with evidence-first discipline.
5. Trace root cause through code, config, logs, tests, and behavior.
6. Identify test gaps and whether additional tests or coverage are needed.
   - `SIMPLE`: ≤ 4 files, one component, ≤ 3 clear criteria, existing pattern, no integration/security/auth/migration/performance risk.
   - `COMPLEX`: ≥ 5 files, multiple components, ambiguous criteria, cross-service/database/API work, no existing pattern, or security/auth/migration/performance risk.
   - If uncertain, default to `COMPLEX`.
7. Classify complexity using objective signals:
   - `SIMPLE`: ≤ 4 files, one component, ≤ 3 clear criteria, existing pattern, no integration/security/auth/migration/performance risk.
   - `COMPLEX`: ≥ 5 files, multiple components, ambiguous criteria, cross-service/database/API work, no existing pattern, or security/auth/migration/performance risk.
   - If uncertain, default to `COMPLEX`.
8. For `COMPLEX` tasks, self-check: is there a simpler root cause or approach?
9. Store debug scripts, reproduction notes, traces, or temporary findings under `tasks/$1/debugging/`.
10. If truth cannot be fully proven from code, propose validation requests: terminal commands, console checks, logs to collect, reproduction steps, or manual checks.
11. If another person must answer, write the question with context and the suggested owner.
12. If a stable reusable fact is learned, record it in `tasks/knowledge/project-patterns.md` or suggest `npm run patterns:add -- <PROJECT-KEY> "fact"`.

## Write `tasks/$1/analysis.md`

Use this structure:

```markdown
# Analysis: $1

## Executive Summary

Business-level overview: issue, impact, recommended direction.

## Complexity Classification

- **Level**: SIMPLE or COMPLEX
- **Confidence**: HIGH / MEDIUM / LOW
- **Reasoning**: Objective signals
- **Tiebreaker Applied**: Yes/No

## Technical Investigation

### Root Cause

- **Primary Issue**: Specific evidence with file path and line when possible
- **Contributing Factors**: If any

### Affected Components

List files/modules with path and role.

### Risk Assessment

**Priority**: HIGH / MEDIUM / LOW — rationale.

### Key Evidence

Top 3–5 findings with file paths and lines when possible.

## Test and Environment Orchestration

- **Detected Local Commands**: package scripts, make targets, test commands, lint, typecheck, build.
- **CI Jobs**: pipeline names, config files, or `not found`.
- **Frameworks**: unit, integration, e2e, coverage, lint, typecheck.
- **Existing Test Locations**: paths.
- **Environment Path**: local, development, staging, production, or unknown.
- **Logs and Observability**: log sources, dashboards, metrics, traces, or `not found`.
- **Manual Validation Paths**: browser checks, console checks, API calls, QA steps, business workflow checks.
- **Coverage Gaps**: what is untested or weakly tested.
- **Recommended New Tests**: tests needed for this task.

## Signals

Only include categories supported by evidence.

- **Cross-repo**:
- **External dependency**:
- **Design decision**:
- **Blocker risk**:
- **Developer input needed**:

## Validation Requests

List checks that can prove or disprove the analysis. Include terminal commands, console checks, logs, reproduction steps, or manual team validation.

## Open Questions

List questions that must be answered by the developer, team, product owner, or external dependency owner. State who should answer when known.

## Recommendations

### Primary Recommendation

- **Action**:
- **Rationale**:
- **Success Criteria**:

### Secondary Recommendations

If any.
```

## Phase gate

Analysis is complete only when:

- Root cause or task objective is confirmed with evidence, or unresolved truth checks are listed under `Validation Requests`.
- Affected components are identified.
- Complexity is classified.
- Business or user impact is documented.
- Test and environment orchestration is detected or explicitly marked as not found.
- Test gaps and recommended tests are documented.
- Open questions are answered or explicitly accepted for manual developer closure.

## Gate check

After writing analysis, run:

```bash
npm run task:gate -- $1 analysis
```

If the gate has unresolved truth checks or open questions, the developer may manually close it with:

```bash
npm run task:gate:close -- $1 analysis "reason for accepting open questions"
```

## Model suggestion

After the analysis gate passes, suggest the model class for planning:

- `COMPLEX`, low confidence, unclear architecture, or active signals → recommend high-reasoning model.
- `SIMPLE`, high confidence, existing pattern → standard model may be acceptable for planning only if risk is low; high-reasoning remains preferred.

Do not switch models automatically. The developer decides.

## Restrictions

- Investigation only.
- No code changes.
- No planning beyond recommendations.
- No writable git decisions.

Keep the final response short and practical.
