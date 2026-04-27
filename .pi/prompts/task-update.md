---
description: Apply delta changes to an existing task while preserving useful work
argument-hint: "<TASK-ID> <what changed>"
---

Update existing task `$1` with new information.

Use `tasks/$1/` as the task context.

## Purpose

Integrate new requirements without restarting the whole workflow. Preserve valuable work. Re-execute only affected phases.

## Inputs

The arguments after `$1` describe what changed:

- Requirement change.
- Technical discovery.
- Meeting outcome.
- Implementation blocker.
- Developer correction.

## Warm-up

Read first:

1. `AGENTS.md`
2. `README.md`
3. `docs/task-workflow.md`
4. `tasks/lessons.md` if present
5. `.pi/workflow/tasks/knowledge/project-patterns.md` if present
6. All root task artifacts:
   - `tasks/$1/README.md`
   - `tasks/$1/analysis.md`
   - `tasks/$1/plan.md`
   - `tasks/$1/implementation.md`
   - `tasks/$1/validation.md`

## Delta update process

1. Identify the new information.
2. Compare it against existing task artifacts.
3. Determine impact by phase:
   - Analysis
   - Planning
   - Implementation
   - Validation
4. Preserve unaffected content.
5. Update only affected sections.
6. If the change invalidates a phase, mark that phase for rework instead of pretending it is valid.
7. If the user correction reveals a reusable lesson, append it to `tasks/lessons.md`.

## Impact levels

Use one of:

- `none`: no change needed.
- `minor`: small section update.
- `significant`: phase content must be revised.
- `major`: phase should be re-run.

## Update report

Write or append a section to `tasks/$1/update.md`:

```markdown
# Update: $1

## Update Context

- **Trigger**:
- **Previous State**:
- **New Information**:

## Change Analysis

| Phase | Impact | Action | Reasoning |
|---|---|---|---|
| Analysis | none/minor/significant/major | preserve/update/re-run | |
| Planning | none/minor/significant/major | preserve/update/re-run | |
| Implementation | none/minor/significant/major | preserve/update/re-run | |
| Validation | none/minor/significant/major | preserve/update/re-run | |

## Results

- **Preserved**:
- **Modified**:
- **Re-executed**:
- **Next Actions**:
```

## Re-run strategy

- Skip when the change is cosmetic or confirms existing work.
- Partially update when the change supplements existing work.
- Re-run when requirements change scope, invalidate architecture, or expose a blocker.

## Model suggestion

After the delta update, suggest the model class for the next phase:

- High-reasoning model if the update changes scope, invalidates analysis, changes architecture, or affects implementation.
- Standard model if the update is cosmetic, clarifying, or documentation-only.

Do not switch models automatically. The developer decides.

## Restrictions

- Do not discard existing task artifacts.
- Do not rewrite unaffected sections.
- Do not make code changes unless explicitly requested.
- Do not run writable git decisions.

Keep the final response short and practical.
