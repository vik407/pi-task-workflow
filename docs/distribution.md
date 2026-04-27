# Distribution

This repository has two usage modes.

## Principle

Keep the target project clean.

When installing into an existing project that may already have folders such as `.claude/`, `.cursor/`, or project-specific scripts, prefer isolating Pi workflow files under `.pi/`.

## 1. Pi resources only

If a project only needs Pi prompts, skills, settings, extensions, and themes, copy the generated `.pi/` folder into the target project root.

```bash
cp -R .pi /path/to/target-project/.pi
cd /path/to/target-project
pi
```

Pi automatically discovers project-local resources from `.pi/`.

This mode includes:

- `.pi/settings.json`
- `.pi/prompts/`
- `.pi/skills/`
- `.pi/extensions/`
- `.pi/themes/`

This mode does not include task gate scripts, fixtures, or helper npm commands.

## 2. Full workflow, isolated under `.pi/`

Recommended for existing projects.

Copy Pi resources and workflow support files under `.pi/workflow/`:

```bash
cp -R .pi /path/to/target-project/.pi
mkdir -p /path/to/target-project/.pi/workflow
cp -R scripts /path/to/target-project/.pi/workflow/scripts
cp -R tasks /path/to/target-project/.pi/workflow/tasks
```

Then merge only the needed scripts into the target project's `package.json`:

```json
{
  "task:init": "node .pi/workflow/scripts/task-workflow.mjs init",
  "task:validate": "node .pi/workflow/scripts/task-workflow.mjs validate",
  "task:status": "node .pi/workflow/scripts/task-workflow.mjs status",
  "task:update": "node .pi/workflow/scripts/task-workflow.mjs update",
  "task:archive": "node .pi/workflow/scripts/task-workflow.mjs archive",
  "task:gate": "node .pi/workflow/scripts/task-gate.mjs",
  "task:gate:close": "node .pi/workflow/scripts/task-gate-close.mjs",
  "patterns:list": "node .pi/workflow/scripts/patterns.mjs list",
  "patterns:add": "node .pi/workflow/scripts/patterns.mjs add"
}
```

The scripts detect this isolated layout and store task data in:

```text
.pi/workflow/tasks/
```

This keeps workflow state away from the project root.

## 3. Full workflow, root-level layout

Use this only when the project wants visible root-level task folders and scripts:

```bash
cp -R .pi /path/to/target-project/.pi
cp -R scripts /path/to/target-project/scripts
cp -R tasks /path/to/target-project/tasks
```

Then merge scripts that point to `scripts/*.mjs`.

Do not blindly overwrite an existing project `package.json`.

## Development mode

When modifying this workflow repository itself, edit `src/`, not `.pi/` directly.

Then run:

```bash
npm run sync
npm run check:drift
```

## Rule

`.pi/` is the clean distribution boundary.

- Light usage: copy `.pi/` only.
- Serious usage: copy `.pi/` and place support files under `.pi/workflow/`.
- Root-level `scripts/` and `tasks/` are useful for developing this workflow repository, but isolated `.pi/workflow/` is better for existing projects.

Do not over-install. Start small. Add only what the project will use.
