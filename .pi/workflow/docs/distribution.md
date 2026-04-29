# Distributed Workflow Usage

## Deploy with sync-pi-resources

The `sync-pi-resources` script supports a `--target` flag that deploys `.pi/` into any project directory. It performs a **smart merge**: source-controlled files (prompts, skills, extensions, themes, scripts) are updated, but runtime-generated content (tasks, sessions, knowledge, lessons) is never overwritten or deleted.

```bash
# Deploy into a local project (updates current .pi/)
node src/workflow/scripts/sync-pi-resources.mjs

# Deploy into an external project (preserves its task state)
node src/workflow/scripts/sync-pi-resources.mjs --target /path/to/target-project
```

### What gets overwritten

These are source-controlled distribution files — they are always updated to match `src/`:

- `settings.json`
- `prompts/**`
- `skills/**`
- `extensions/**`
- `themes/**`
- `workflow/README.md`, `workflow/CHANGELOG.md`
- `workflow/docs/**`
- `workflow/scripts/**`

### What gets preserved

These are generated at runtime — they are never overwritten or deleted by sync:

- `sessions/**` — agent session logs
- `workflow/tasks/<TASK-ID>/` — active and archived tasks
- `workflow/tasks/lessons.md` — accumulated lessons
- `workflow/tasks/knowledge/project-patterns.md` — recorded patterns

## Manual copy (alternative)

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
