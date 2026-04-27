---
description: Execute Phase 3 implementation using AUTO or GUIDED mode
argument-hint: "<TASK-ID> [AUTO|GUIDED]"
---

Execute Phase 3 implementation for task `$1` using mode `$2`.

Use `tasks/$1/` as the task context.

## Prerequisites

- `tasks/$1/analysis.md` must exist.
- `tasks/$1/plan.md` must exist.
- If mode is missing, default to `GUIDED`.

## Warm-up

Read first:

1. `AGENTS.md`
2. `README.md`
3. `docs/task-workflow.md`
4. `tasks/lessons.md` if present
5. `tasks/$1/analysis.md`
6. `tasks/$1/plan.md`

## Mode rules

### AUTO

Use only when the plan is clear, low-risk, and bounded.

- Follow `plan.md` exactly.
- Keep changes within task scope.
- Run validation continuously when practical.
- Update checklist progress in `plan.md`.
- Update `tasks/$1/implementation.md`.
- Update `tasks/$1/validation.md` with commands and results.

### GUIDED

Use for complex, risky, ambiguous, or multi-component work.

- Create or update `tasks/$1/implementation-guide.md`.
- Provide step-by-step file changes.
- Define checkpoints between steps.
- Track developer progress in `tasks/$1/dev-implementation.md` if useful.
- Ask before major changes.

## Stop-and-pivot protocol

Stop and ask for direction when:

- Two or more unexpected issues appear.
- A core assumption proves false.
- The plan reaches a technical dead end.
- Tests reveal a design flaw.
- Scope expands beyond `plan.md`.
- A destructive operation is needed.

When stopping, document:

- What failed.
- What was preserved.
- Options forward.
- Recommended next action.

## Parallel validation

When implementation spans multiple layers, store detailed findings under:

```text
tasks/$1/validation/
```

Then synthesize results into root `tasks/$1/validation.md`. Downstream prompts read the root file.

## Write `tasks/$1/implementation.md`

Include:

- Approach taken.
- Technical decisions.
- Files changed with purpose.
- Deviations from plan.
- Checklist progress.
- Remaining work.

## Gate check

After implementation notes are updated, run:

```bash
node .pi/workflow/scripts/task-gate.mjs $1 implementation
```

## Model suggestion

After the implementation gate passes, suggest the model class for validation:

- Standard model is acceptable when validation uses real deterministic command output.
- High-reasoning model is recommended if failures appear, signals remain, or validation requires interpretation.

Do not switch models automatically. The developer decides.

## Restrictions

- Plan adherence is mandatory.
- No feature additions beyond task scope.
- Do not skip quality gates.
- Do not run git commit, push, pull, merge, rebase, reset, tag, or destructive checkout/switch unless explicitly requested.

Keep the final response short and practical.
