# pi-workflow

Repository for storing configurations, customizations, and reusable resources for [Pi Coding Agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent#readme).

## What is Pi?

Pi is a minimal, extensible terminal coding agent harness. It gives an AI model project-aware tools such as reading files, editing files, writing files, and running shell commands. Pi is intentionally small and expects teams to shape their own workflows through project context files, prompt templates, skills, extensions, themes, and packages.

## What is this workflow?

`pi-workflow` is a structured software development workflow for Pi.

It turns Pi from a general coding assistant into a task-oriented development system with:

- Scrum/Kanban-style task workspaces.
- Analysis, planning, implementation, and validation phases.
- Gate checks that enforce useful task artifacts.
- Model recommendations by phase and complexity.
- Environment-aware validation beyond CI.
- Learning patterns to avoid repeated discovery.
- Real project fixtures to harden the workflow.
- Git safety rules that leave final writable decisions to the developer.

## What is it for?

Use this workflow when you want Pi to help with disciplined software delivery:

- Start work from a ticket such as `ABC-0123`.
- Preserve task context across sessions.
- Avoid hallucinated analysis by requiring evidence, validation requests, and open questions.
- Plan implementation before changing code.
- Validate with local tests, CI, environments, logs, or manual checks.
- Record reusable knowledge so future tasks do not repeat the same discovery.
- Draft PR content without letting the assistant commit, push, merge, or overwrite developer work.

The goal is not ceremony. The goal is useful control.

## Non-negotiable language requirement

All repository documentation, prompts, skills, agent instructions, and assistant responses for this project must be written in English, regardless of whether the user writes in English or Spanish.

Assistant communication must also be Stoic in style: short, concise, practical, calm, and direct.

When complexity, hallucination risk, fake parity, or over-engineering may appear, the assistant should give a clear Stoic heads-up. Example:

> We should not chase fake parity. Use it. Observe it. Improve from real tasks.

## Structure

```text
.
├── AGENTS.md                 # Project context instructions for Pi
├── src/                      # Source of truth for Pi resources
│   ├── settings.json         # Source settings copied to .pi/settings.json
│   ├── prompts/              # Source prompt templates
│   ├── skills/               # Source skills
│   ├── extensions/           # Source TypeScript/JavaScript extensions
│   ├── themes/               # Source JSON themes
│   └── workflow/             # Source workflow support copied to .pi/workflow
│       ├── scripts/          # Source validation and task scripts
│       └── tasks/            # Source task templates, lessons, and patterns
├── .pi/                      # Generated Pi runtime structure loaded by Pi
│   ├── settings.json
│   ├── prompts/
│   ├── skills/
│   ├── extensions/
│   ├── themes/
│   └── workflow/             # Generated isolated workflow support
│       ├── scripts/
│       └── tasks/
├── fixtures/                 # Real project fixtures for workflow hardening
├── docs/                     # Workflow notes and project documentation
├── CHANGELOG.md              # History of meaningful repository changes
└── package.json              # Optional manifest for sharing as a pi-package
```

## Workflow

Edit resources under `src/`. After validating them, synchronize them into `.pi/`, which is the structure Pi loads at runtime.

```bash
npm run validate
npm run sync
```

Use `npm run build` as an alias for the full synchronization workflow:

```bash
npm run build
```

`npm run sync` validates first and then copies:

- `src/settings.json` → `.pi/settings.json`
- `src/prompts/` → `.pi/prompts/`
- `src/skills/` → `.pi/skills/`
- `src/extensions/` → `.pi/extensions/`
- `src/themes/` → `.pi/themes/`
- `src/workflow/` → `.pi/workflow/`

### Documentation and changelog workflow

- Keep `README.md` updated whenever the workflow, structure, commands, or expected usage changes.
- Keep `CHANGELOG.md` updated for every meaningful repository change.
- Add new changes under the `[Unreleased]` section first.
- Write all documentation and changelog entries in English only.

### Git safety workflow

- Do not run git commands that can overwrite, publish, or finalize developer work unless explicitly requested.
- Avoid automatic merge, pull, rebase, reset, destructive checkout/switch, commit, tag, and push.
- Suggest git commands, commit messages, PR titles, and PR descriptions when useful.
- Leave final writable git decisions to the developer.

## Task workflow

Work is organized by task code, such as `ABC-0123`.

Each distributed task gets a dedicated workspace under `.pi/workflow/tasks/<TASK-ID>/` with this lifecycle:

1. Analysis and discovery
2. Planning
3. Implementation
4. Validation

In an existing project using isolated distribution, create and inspect task workspaces with:

```bash
node .pi/workflow/scripts/task-workflow.mjs init ABC-0123 "Short task title"
node .pi/workflow/scripts/task-workflow.mjs validate ABC-0123
node .pi/workflow/scripts/task-workflow.mjs status ABC-0123
node .pi/workflow/scripts/task-workflow.mjs update ABC-0123 "What changed"
node .pi/workflow/scripts/task-gate.mjs ABC-0123 analysis
node .pi/workflow/scripts/task-gate-close.mjs ABC-0123 analysis "accepted after team confirmation"
node .pi/workflow/scripts/task-workflow.mjs archive ABC-0123
```

If the target project chooses to merge package scripts, `npm run task:*` aliases may be used. They are optional.

Use Pi prompt templates:

```text
/task-init ABC-0123 Short task title
/task-analyze ABC-0123
/task-plan ABC-0123
/task-implement ABC-0123 AUTO
/task-update ABC-0123 What changed
/task-gate ABC-0123 analysis
/task-validate ABC-0123
/task-pr ABC-0123
/task-archive ABC-0123
/task-status ABC-0123
```

See `docs/task-workflow.md`, `docs/model-policy.md`, `docs/environment-validation.md`, `docs/multi-agent-orchestration.md`, and `docs/release-readiness.md` for details.

At the end of analysis, planning, implementation, validation, and delta updates, the assistant should suggest the model class for the next phase. It must not switch models automatically.

Gates check structure, not truth. When analysis cannot prove truth from repository evidence, it must list test and environment orchestration, validation requests, and open questions. If a test framework exists, the plan should add tests or coverage when needed. If CI is missing, the plan should define local, development, staging, production, logs, or manual validation paths. The developer may manually close a gate after accepting the risk.

## Usage and distribution

This repository contains the full source workflow.

For development of the workflow, edit `src/` and run:

```bash
npm run sync
```

For using the workflow inside another project, users only need the generated `.pi/` folder for Pi behavior.

Copy or update this folder into the target project root:

```bash
cp -R .pi /path/to/target-project/.pi
```

Then run Pi from the target project:

```bash
cd /path/to/target-project
pi
```

Pi will load the copied project-local resources from `.pi/`.

If the target project also wants task gates, task storage, and learning patterns, they are already included under `.pi/workflow/` after `npm run sync`.

The generated `.pi/workflow/` folder includes its own `README.md` and `CHANGELOG.md` for target-project users.

No root-level `scripts/` or `tasks/` folders are required in the target project.

Optional package aliases may point to `.pi/workflow/scripts/*.mjs`.

Simple rule:

- Need only Pi prompts, skills, settings, extensions, and themes → copy `.pi/`.
- Need full task discipline without polluting the target project root → copy `.pi/` plus `.pi/workflow/scripts` and `.pi/workflow/tasks`.
- Avoid overwriting an existing project `package.json`; merge scripts deliberately.

## Quick start

From this repository:

```bash
npm run sync
pi
```

Pi will automatically load:

- `AGENTS.md` as project context.
- `.pi/settings.json` as local overrides.
- `.pi/prompts/*.md` as `/name` commands.
- `.pi/skills/**/SKILL.md` as skills.
- `.pi/extensions/*.{ts,js}` as extensions.
- `.pi/themes/*.json` as themes.

## Included resources

### Prompts

- `/plan` — create a work plan in `TODO.md`.
- `/review` — review repository changes.
- `/finish` — finish a task with verification.
- `/task-init` — create a task workspace.
- `/task-analyze` — perform analysis and discovery for a task.
- `/task-plan` — create a task implementation plan.
- `/task-implement` — implement a planned task.
- `/task-update` — apply delta changes while preserving useful work.
- `/task-validate` — validate a task and record results.
- `/task-status` — summarize task state and unresolved signals.
- `/task-gate` — run enforced phase gates.
- `/task-pr` — draft PR content without git writes.
- `/task-archive` — archive task workspaces by developer decision.
- `/task-model` — suggest model class for the next phase.
- `/patterns` — list or record reusable project patterns.

### Skills

- `/skill:pi-workflow` — guidance for maintaining this Pi configuration repository.

## Learning patterns

Reusable project knowledge lives in `.pi/workflow/tasks/knowledge/project-patterns.md` for distributed projects and `src/workflow/tasks/knowledge/project-patterns.md` while developing this workflow repository.

Use it to avoid repeated discovery of stable facts, such as stack, database, commands, validation paths, environments, and conventions.

```bash
node .pi/workflow/scripts/patterns.mjs list PROJECT-KEY
node .pi/workflow/scripts/patterns.mjs add PROJECT-KEY "Node + Angular + PostgreSQL; tests run with npm test"
```

Optional npm aliases may be merged into the target project, but the isolated workflow does not require them.

Do not overdo it. Learn once. Reuse often. Update when evidence changes.

## Fixture strategy

Two fixture levels harden the workflow:

- `npm run test:fixture` validates workflow mechanics with a disposable task.
- `npm run test:fixture:project` validates a real sample Node.js project with source code, tests, and task artifacts.

The real project fixture lives in `fixtures/sample-node-project/` and proves that gates can work against executable project code, not only synthetic artifacts.

## Distribution package

The full repository is source code.

The distribution artifact is only the generated `.pi/` folder.

Build it with:

```bash
npm run dist
```

Output:

```text
dist/.pi/
```

Use `dist/.pi/` when publishing or copying only the runtime workflow into another project.

## Release readiness

Before treating workflow changes as production-ready, run:

```bash
npm run validate
npm run sync
npm run check:drift
npm run test:fixture
npm run test:fixture:project
npm run dist
```

## Pi packages

Install packages only for this project with:

```bash
pi install -l npm:package-name
pi install -l git:github.com/user/repo
pi list
pi config
```

> Security: review any third-party package, skill, or extension before installing it; extensions run with full system access.
