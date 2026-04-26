---
description: Summarize task workspace status and unresolved signals
argument-hint: "<TASK-ID>"
---

Summarize status for task `$1`.

Use `tasks/$1/` as the task context.

Expected work:

1. Read `tasks/$1/README.md`, `analysis.md`, `plan.md`, `implementation.md`, and `validation.md`.
2. Summarize current phase.
3. List unresolved signals.
4. List next practical action.
5. Keep the response short and practical.
