# Changelog

All notable changes to this repository must be documented in this file.

The format follows the spirit of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses an unreleased-first workflow.

## [Unreleased]

### Added

- Model policy documentation in `docs/model-policy.md`.
- Release readiness documentation in `docs/release-readiness.md`.
- Task gate enforcement through `scripts/task-gate.mjs` and `npm run task:gate`.
- Drift detection through `scripts/check-drift.mjs` and `npm run check:drift`.
- Task fixture test through `scripts/task-fixture.mjs` and `npm run test:fixture`.
- Task archive workflow through `npm run task:archive` and `/task-archive`, with archive decisions left to the developer.
- PR drafting prompt `/task-pr` with no writable git actions.
- Model suggestion prompt `/task-model` and end-of-phase model recommendation rules.
- Multi-agent orchestration position documented in `docs/multi-agent-orchestration.md`, keeping true sub-agent orchestration as a future Pi extension until official APIs are mature.
- Manual gate closure workflow through `npm run task:gate:close` and `tasks/<TASK-ID>/gate-decisions.md`.
- Analysis truth-handling sections for test orchestration, validation requests, and open questions.
- Learning pattern workflow using `tasks/knowledge/project-patterns.md`, `/patterns`, `npm run patterns:list`, and `npm run patterns:add` to avoid repeated discovery.
- Real project fixture under `fixtures/sample-node-project/` with executable source code, tests, task artifacts, and `npm run test:fixture:project`.
- Environment validation documentation for local, development, staging, production, logs, and manual QA paths.
- Validation hardening that prefers detected test and environment orchestration and requires reasons for skipped checks.
- Production-readiness update plan in `TODO.md` for gate enforcement, model policy, archive workflow, drift checks, and release criteria.
- Scrum/Kanban-style task workflow with task folders under `tasks/<TASK-ID>/`.
- Task lifecycle documentation: analysis and discovery, planning, implementation, validation.
- Task management script with `init`, `validate`, and `status` commands.
- Pi task prompt templates for task initialization, analysis, planning, implementation, delta update, validation, and status.
- Task lessons and project-pattern memory files under `tasks/`.
- Delta update support through `/task-update` and `npm run task:update`.
- Git safety requirement: avoid automatic merge, pull, rebase, reset, destructive checkout/switch, commit, tag, and push unless explicitly requested.
- Stoic heads-up guidance for decisions where complexity, hallucination risk, fake parity, or over-engineering may appear.
- Stoic communication requirement: responses must be short, concise, practical, calm, and direct.
- Initial `pi-workflow` repository structure for Pi Coding Agent customizations.
- Project-local `.pi/` runtime structure for Pi settings, prompts, skills, extensions, and themes.
- `src/` source-of-truth structure that mirrors `.pi/`.
- Validation and synchronization scripts:
  - `scripts/validate-pi-resources.mjs`
  - `scripts/sync-pi-resources.mjs`
- Package scripts for validating, syncing, building, and launching Pi.
- Project prompts:
  - `/plan`
  - `/review`
  - `/finish`
- `pi-workflow` skill for maintaining this repository.
- Non-negotiable English-only requirement for responses, documentation, prompts, skills, and generated repository content.
- README workflow documentation describing how `src/` resources are validated and copied into `.pi/`.

### Changed

- Expanded `README.md` with project introduction, Pi overview, workflow purpose, and intended usage.
- `.pi/` is treated as generated runtime output from validated `src/` resources.

## Changelog maintenance rules

- Add every meaningful repository change under `[Unreleased]` during development.
- Use concise entries grouped under `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, or `Security`.
- Keep entries in English only.
- When preparing a release, rename `[Unreleased]` to the release version and date, then create a new empty `[Unreleased]` section at the top.
