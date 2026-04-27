# Release Readiness

This workflow is production-ready only when checks are objective, repeatable, and documented.

## Required Checks

Run:

```bash
npm run validate
npm run sync
npm run check:drift
npm run test:fixture
npm run test:fixture:project
npm run dist
```

## Release Criteria

- Pi resources validate.
- `.pi/` matches generated output from `src/`.
- Disposable task fixture passes.
- Real project fixture passes.
- Distribution package builds to `dist/.pi/`.
- Documentation is current.
- `CHANGELOG.md` is updated under `[Unreleased]`.
- No secrets are present.
- No generated runtime sessions are committed.

## Task Quality Criteria

For a completed task:

```bash
node .pi/workflow/scripts/task-gate.mjs ABC-0123 analysis
node .pi/workflow/scripts/task-gate.mjs ABC-0123 plan
node .pi/workflow/scripts/task-gate.mjs ABC-0123 implementation
node .pi/workflow/scripts/task-gate.mjs ABC-0123 validation
```

In this workflow repository, the equivalent npm aliases are also available.

A task is not complete until validation passes or remaining manual checks are documented.

Archiving is different from completion. A developer may archive a task because of completion, external handoff, project manager decision, backlog return, cancellation, or accepted risk.

## Fixture Strategy

Use two fixture levels:

- `npm run test:fixture` checks workflow mechanics with a disposable task.
- `npm run test:fixture:project` checks a real sample Node.js project with source code, tests, and task artifacts.

The real fixture lives in `fixtures/sample-node-project/`.

## Known Limits

- Model policy is advisory.
- True multi-agent orchestration needs a future Pi extension.
- Gate scripts validate structure and evidence markers; they cannot prove correctness.

Judgment remains with the developer.
