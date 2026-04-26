# AGENTS.md — pi-workflow

This repository contains configurations and customizations for Pi Coding Agent.

## Language

- Non-negotiable: always respond in English, regardless of whether the user writes in English or Spanish.
- Communicate in a Stoic style inspired by Marcus Aurelius: short, concise, practical, calm, and direct.
- Use Stoic heads-up guidance when complexity, hallucination risk, fake parity, or over-engineering may appear. Example: "We should not chase fake parity. Use it. Observe it. Improve from real tasks."
- All documentation, prompts, skills, comments, commit messages, and generated repository content must be written in English.
- If existing content is found in another language, translate it to English before extending it.

## Repository goal

- Centralize Pi settings, prompts, skills, extensions, and themes.
- Keep `src/` as the source of truth and generate `.pi/` from it only after validation.
- Document workflow decisions in `docs/`.
- Keep `README.md` updated when the workflow, structure, commands, or usage changes.
- Keep `CHANGELOG.md` updated for every meaningful repository change under `[Unreleased]`.
- Keep resources reusable and easy to share.

## Conventions

- Source of truth: `src/`.
- Generated Pi runtime directory: `.pi/`.
- Project-local Pi configuration source: `src/settings.json`.
- Prompt templates source: `src/prompts/*.md`.
- Skills source: `src/skills/<name>/SKILL.md`.
- Extensions source: `src/extensions/*.{ts,js}`.
- Themes source: `src/themes/*.json`.
- Temporary work plans: `TODO.md`.
- Task workspaces: `tasks/<TASK-ID>/`, where task ids match `^[A-Z]+-[0-9]+$`.

## Editing rules

- Before changing Pi resources, review the locally installed Pi documentation when needed:
  - Main Pi README.
  - `docs/settings.md`, `docs/prompt-templates.md`, `docs/skills.md`, `docs/extensions.md`, `docs/themes.md`, `docs/packages.md` as applicable.
- Do not store secrets, API keys, or tokens in the repository.
- Do not version sessions or locally installed packages under `.pi/sessions`, `.pi/npm`, or `.pi/git`.
- Update `CHANGELOG.md` whenever files, behavior, scripts, prompts, skills, settings, extensions, themes, or documentation change.
- Do not run git commands that can overwrite, publish, or finalize developer work unless explicitly requested. This includes automatic merge, pull, rebase, reset, checkout/switch that discards changes, commit, tag, and push.
- It is acceptable to suggest git commands, commit messages, PR titles, and PR descriptions. Leave final writable git decisions to the developer.

## Task workflow

Use task workspaces for Scrum/Kanban-style work.

Lifecycle:

1. Analysis and discovery
2. Planning
3. Implementation
4. Validation

Task folder shape:

```text
tasks/<TASK-ID>/
├── README.md
├── analysis.md
├── analysis/
├── plan.md
├── implementation.md
├── validation.md
├── validation/
├── context/
└── debugging/
```

Root files are the source of truth. Optional folders hold parallel or domain-specific findings.

Signals are informational only: cross-repo, external dependency, design decision, blocker risk, developer input needed. The developer decides the response.

Analysis may finish with validation requests and open questions. The assistant should suggest terminal checks, console checks, logs to collect, or questions for teammates. The developer manually closes gates when accepting unresolved risk.

Reuse learned project patterns from `tasks/knowledge/project-patterns.md`. Do not rediscover stable facts on every task. Learn once, reuse often, update when evidence changes.

## Useful commands

```bash
npm run validate
npm run sync
npm run build
npm run task:init -- ABC-0123 "Short task title"
npm run task:validate -- ABC-0123
npm run task:status -- ABC-0123
npm run task:update -- ABC-0123 "What changed"
npm run task:gate -- ABC-0123 analysis
npm run task:gate:close -- ABC-0123 analysis "accepted after team confirmation"
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
