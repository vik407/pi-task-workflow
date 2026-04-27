# Pi Task Workflow Distribution

This folder contains the distributed Pi task workflow.

It is designed to live inside a target project under:

```text
.pi/workflow/
```

## What is included

```text
.pi/workflow/
├── README.md
├── CHANGELOG.md
├── scripts/
├── tasks/
└── docs/
```

## How to use

From the target project root:

```bash
node .pi/workflow/scripts/task-workflow.mjs init ABC-0123 "Short task title"
node .pi/workflow/scripts/task-gate.mjs ABC-0123 analysis
node .pi/workflow/scripts/patterns.mjs list PROJECT-KEY
```

Task data is stored in:

```text
.pi/workflow/tasks/
```

## Distribution rule

Use `.pi/` as the clean boundary.

Do not copy root-level `scripts/` or `tasks/` into target projects.

## Source code

The source version of this workflow lives in the repository under:

```text
src/workflow/
```

The full repository is source code. The generated `.pi/` folder is the distribution artifact.

Use it. Observe it. Improve from real tasks.
