---
description: Archive a completed task after validation
argument-hint: "<TASK-ID>"
---

Archive task `$1`.

Recommended first:

```bash
node .pi/workflow/scripts/task-gate.mjs $1 validation
```

Then ask the developer whether to archive.

Archive may be valid even with open validation when the decision is external, such as handoff to another team, project manager decision, backlog return, cancellation, or accepted risk.

If the developer confirms, run:

```bash
node .pi/workflow/scripts/task-workflow.mjs archive $1
```

Rules:

1. Preserve all task artifacts.
2. Report validation status before archive.
3. Leave the archive decision to the developer.
4. Do not make git decisions.

Keep the response short and practical.
