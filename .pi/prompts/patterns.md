---
description: List or record reusable project patterns to avoid repeated discovery
argument-hint: "<list|add> <PROJECT-KEY> [pattern]"
---

Manage learned project patterns.

Use:

```bash
npm run patterns:list -- $2
npm run patterns:add -- $2 "${@:3}"
```

Rules:

1. Do not over-record obvious noise.
2. Record stable facts only: stack, architecture, commands, validation paths, environments, conventions.
3. Update patterns when evidence changes.
4. Reuse patterns during future task analysis.
5. Keep entries short.

Keep the response practical.
