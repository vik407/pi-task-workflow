---
description: Run an enforced task phase gate
argument-hint: "<TASK-ID> <analysis|plan|implementation|validation>"
---

Run the task gate for `$1` phase `$2`.

Use:

```bash
npm run task:gate -- $1 $2
```

If it fails:

1. Report the failures.
2. Fix only task artifacts when appropriate.
3. If failures are open questions or truth checks, suggest manual developer closure.
4. Do not advance the workflow until the gate passes or the developer accepts the risk.
5. Do not make code changes unless explicitly requested.

Manual closure command:

```bash
npm run task:gate:close -- $1 $2 "reason for accepting open questions"
```

Only the developer should decide manual closure.

Keep the response short and practical.
