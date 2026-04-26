---
name: pi-workflow
description: Maintains and evolves this Pi configuration repository. Use when creating, modifying, or documenting settings, prompts, skills, extensions, themes, or Pi packages.
---

# Pi Workflow

Use this skill when working inside the `pi-workflow` repository or when the user requests Pi customizations.

## Language requirement

- Always produce responses and repository content in English, regardless of the user's input language.
- Communicate in a Stoic style inspired by Marcus Aurelius: short, concise, practical, calm, and direct.
- Use Stoic heads-up guidance when complexity, hallucination risk, fake parity, or over-engineering may appear. Example: "We should not chase fake parity. Use it. Observe it. Improve from real tasks."
- Translate existing non-English content to English before extending or reusing it.

## Goals

- Maintain a clear structure for Pi resources.
- Keep `src/` as the source of truth and generate `.pi/` only after validation.
- Prefer project-local configuration over global changes.
- Document decisions in `README.md` or `docs/`.
- Keep `README.md` updated when the workflow, structure, commands, or usage changes.
- Keep `CHANGELOG.md` updated for every meaningful repository change under `[Unreleased]`.
- Support Scrum/Kanban-style task workspaces under `tasks/<TASK-ID>/`.
- Reuse learned project patterns from `tasks/knowledge/project-patterns.md`; do not rediscover stable facts on every task.
- Avoid secrets and runtime artifacts in git.

## Recommended workflow

1. Identify which source resource type will be modified:
   - Settings: `src/settings.json`
   - Prompt templates: `src/prompts/*.md`
   - Skills: `src/skills/<name>/SKILL.md`
   - Extensions: `src/extensions/*.{ts,js}`
   - Themes: `src/themes/*.json`
   - Package metadata: `package.json`
   - Task workflow documentation: `docs/task-workflow.md`
   - Multi-agent orchestration documentation: `docs/multi-agent-orchestration.md`
2. Review the applicable local Pi documentation before implementing significant changes.
3. Validate names and formats:
   - Skills: lowercase names with hyphens, and `name` must match the parent directory.
   - Prompts: optional frontmatter with `description` and `argument-hint`.
   - Settings: valid JSON and paths relative to `.pi` when defined in `.pi/settings.json`.
4. Run `npm run validate` before synchronizing generated resources.
5. Run `npm run sync` to copy validated resources from `src/` into `.pi/`.
6. Update `README.md` if the workflow, structure, commands, or usage changes.
7. Update `CHANGELOG.md` under `[Unreleased]` for meaningful changes.
8. Do not store API keys, tokens, sessions, downloaded packages, or sensitive data.
9. Do not run git commands that can overwrite, publish, or finalize developer work unless explicitly requested. Suggest git commands, commit messages, PR titles, and PR descriptions instead.
10. For task-based work, use `tasks/<TASK-ID>/` with the lifecycle: analysis and discovery, planning, implementation, validation.
11. Do not build undocumented pseudo-sub-agent orchestration. Keep true multi-agent orchestration as future work unless official Pi documentation supports a stable implementation pattern.
12. Record stable reusable knowledge in `tasks/knowledge/project-patterns.md` and reuse it on later tasks.

## Useful commands

```bash
npm run validate
npm run sync
npm run build
npm run task:init -- ABC-0123 "Short task title"
npm run task:gate -- ABC-0123 analysis
npm run task:gate:close -- ABC-0123 analysis "accepted after team confirmation"
npm run task:update -- ABC-0123 "What changed"
npm run task:archive -- ABC-0123
npm run check:drift
npm run test:fixture
npm run test:fixture:project
npm run patterns:list -- PROJECT-KEY
npm run patterns:add -- PROJECT-KEY "pattern"
pi
pi list
pi config
pi install -l npm:<package>
pi install -l git:github.com/<user>/<repo>
```

## Minimum verification

```bash
npm run validate
npm run sync
npm run check:drift
npm run test:fixture
npm run test:fixture:project
find src/prompts -maxdepth 1 -name '*.md' -print
find src/skills -name SKILL.md -print
```
