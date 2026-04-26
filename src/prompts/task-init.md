---
description: Initialize a task workspace and complete first-pass analysis
argument-hint: "<TASK-ID> [title or description]"
---

Initialize task workflow for `$1`.

Use `tasks/$1/` as the task context.

## Instructions

1. Validate task id against `^[A-Z]+-[0-9]+$`.
2. Run `node scripts/task-workflow.mjs init $ARGUMENTS`.
3. Load project context:
   - `AGENTS.md`
   - `README.md`
   - `docs/task-workflow.md`
   - `tasks/lessons.md` if present
4. Integrate external context when available:
   - `tasks/$1/context/`
   - user-provided ticket details
   - local notes related to `$1`
5. Perform first-pass analysis and update `tasks/$1/analysis.md`.
6. Document assumptions in `tasks/$1/analysis.md`.

## analysis.md must include

- Executive summary.
- Complexity classification: `SIMPLE` or `COMPLEX`, confidence, reasoning, tiebreaker applied.
- Technical investigation with evidence.
- Affected components.
- Risk assessment.
- Signals: cross-repo, external dependency, design decision, blocker risk, developer input needed.
- Recommendations and success criteria.

## Restrictions

- No code changes during initialization.
- No planning until analysis is present.
- No writable git decisions.

## Output

Report only:

- Workspace path.
- Context loaded.
- External context found or not found.
- Analysis status.
- Next practical step.
