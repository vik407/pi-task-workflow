---
description: Validate a task and record results in its task workspace
argument-hint: "<TASK-ID>"
---

Validate task `$1`.

Use `tasks/$1/` as the task context.

Expected work:

1. Read `tasks/$1/analysis.md`, `tasks/$1/plan.md`, and `tasks/$1/implementation.md`.
2. Use the test and environment orchestration detected in `analysis.md`.
3. Run reasonable validation commands for the project.
4. Prefer real tests over manual checks when a test framework exists.
5. Include environment-specific validation when relevant: local, development, staging, production, logs, monitoring, or manual QA.
6. If new tests were recommended, verify they were added or explain why not.
7. Record commands, environment checks, log checks, manual validations, and results in `tasks/$1/validation.md`.
7. List remaining risks or manual checks.
8. Run `npm run task:gate -- $1 validation` after recording results.
9. Suggest, but do not run, final git commands.
10. Suggest the model class for PR drafting or follow-up:
   - Standard model is acceptable for PR drafting when validation passed.
   - High-reasoning model is recommended if validation failed, was skipped, or risks remain.

Do not switch models automatically. The developer decides.

Keep the final response short and practical.
