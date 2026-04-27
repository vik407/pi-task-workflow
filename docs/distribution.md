# Distribution

This repository has two usage modes.

## Principle

Keep the target project clean.

When installing into an existing project that may already have folders such as `.claude/`, `.cursor/`, or project-specific scripts, keep Pi workflow files isolated under `.pi/`.

## Source and generated layout

In this repository, `src/` is the source of truth.

```text
src/workflow/
├── scripts/
└── tasks/
```

During sync, it is copied to:

```text
.pi/workflow/
├── scripts/
└── tasks/
```

Distributed projects should consume `.pi/`, not `src/`.

The generated `.pi/workflow/` folder includes a distribution-specific `README.md` and `CHANGELOG.md`.

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

## 2. Full workflow, isolated under `.pi/`

Recommended for existing projects.

Copy the generated `.pi/` folder. It already contains workflow support under `.pi/workflow/` after `npm run sync`.

```bash
cp -R .pi /path/to/target-project/.pi
```

Expected target layout:

```text
.pi/
├── settings.json
├── prompts/
├── skills/
├── extensions/
├── themes/
└── workflow/
    ├── scripts/
    └── tasks/
```

Run commands directly from the isolated workflow:

```bash
node .pi/workflow/scripts/task-workflow.mjs init ABC-0123 "Short task title"
node .pi/workflow/scripts/task-gate.mjs ABC-0123 analysis
node .pi/workflow/scripts/patterns.mjs list PROJECT-KEY
```

Optional: merge aliases into the target project's `package.json` only if the team wants shorter commands:

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

Do not require package script aliases. They are convenience only.

The scripts detect this isolated layout and store task data in:

```text
.pi/workflow/tasks/
```

This keeps workflow state away from the project root.

## Distribution package

The full repository is source code.

The distribution package contains only generated `.pi/`:

```bash
npm run dist
```

Output:

```text
dist/.pi/
```

Use `dist/.pi/` when publishing or copying the runtime workflow into another project.

## Development mode

When modifying this workflow repository itself, edit `src/`, not `.pi/` directly.

Then run:

```bash
npm run sync
npm run check:drift
```

## Rule

`.pi/` is the clean distribution boundary.

- Light usage: copy `.pi/` and use prompts, skills, settings, extensions, and themes.
- Serious usage: copy `.pi/` and use `.pi/workflow/scripts` plus `.pi/workflow/tasks`.
- Do not copy root-level `scripts/` or `tasks/`; they are no longer part of the distribution model.

Do not over-install. Start small. Add only what the project will use.
