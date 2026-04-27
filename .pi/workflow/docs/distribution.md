# Distributed Workflow Usage

Copy the generated `.pi/` folder into a target project.

```bash
cp -R .pi /path/to/target-project/.pi
```

Then run commands from the target project root:

```bash
node .pi/workflow/scripts/task-workflow.mjs init ABC-0123 "Short task title"
node .pi/workflow/scripts/task-gate.mjs ABC-0123 analysis
node .pi/workflow/scripts/task-gate-close.mjs ABC-0123 analysis "accepted after team confirmation"
node .pi/workflow/scripts/patterns.mjs list PROJECT-KEY
```

Optional package aliases may be added to the target project's `package.json`, but they are not required.

Keep the workflow isolated under `.pi/`.
