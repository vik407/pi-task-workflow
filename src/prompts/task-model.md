---
description: Suggest the next model choice based on task phase and complexity
argument-hint: "<TASK-ID> <next-phase>"
---

Suggest the model choice for task `$1` before phase `$2`.

Read:

1. `docs/model-policy.md`
2. `tasks/$1/analysis.md` if present
3. `tasks/$1/plan.md` if present

Rules:

- Do not switch models automatically.
- Suggest only.
- The developer decides.
- If complexity is `COMPLEX`, recommend a high-reasoning model for analysis, planning, implementation, and significant updates.
- If complexity is `SIMPLE`, standard models are acceptable for implementation, validation, status, and PR drafting.
- If uncertainty is high, recommend a high-reasoning model.

Output:

- Current inferred complexity.
- Next phase.
- Recommended model class: high-reasoning or standard.
- Reason.
- One practical next command.

Keep the response short.
