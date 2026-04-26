---
description: Draft PR content from a task workspace without making git changes
argument-hint: "<TASK-ID>"
---

Draft PR content for task `$1`.

Use `tasks/$1/` as the source of truth.

Read:

1. `tasks/$1/analysis.md`
2. `tasks/$1/plan.md`
3. `tasks/$1/implementation.md`
4. `tasks/$1/validation.md`

Produce only:

- PR title.
- PR description.
- Summary of changes.
- Validation summary.
- Risk summary.
- Suggested commit message.

Restrictions:

- Do not commit.
- Do not push.
- Do not tag.
- Do not merge.
- Do not pull or rebase.
- Do not run destructive checkout/switch/reset.

Keep it concise.
