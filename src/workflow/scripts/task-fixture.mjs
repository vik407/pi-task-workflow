#!/usr/bin/env node
import { rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const taskId = "ABC-0123";
const tasksRoot = path.join(root, "src", "workflow", "tasks");
const taskDir = path.join(tasksRoot, taskId);
const workflowEnv = { ...process.env, PI_WORKFLOW_TASKS_DIR: "src/workflow/tasks" };

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit", env: workflowEnv });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

await rm(taskDir, { recursive: true, force: true });
run(["src/workflow/scripts/task-workflow.mjs", "init", taskId, "Fixture task"]);

await writeFile(path.join(taskDir, "analysis.md"), `# Analysis: ${taskId}

## Executive Summary

Fixture validates task gate behavior using src/workflow/scripts/task-fixture.mjs evidence.

## Complexity Classification

- **Level**: SIMPLE
- **Confidence**: HIGH
- **Reasoning**: One script fixture, no product code.
- **Tiebreaker Applied**: No

## Technical Investigation

### Root Cause

- **Primary Issue**: Fixture-only validation in src/workflow/scripts/task-fixture.mjs.
- **Contributing Factors**: None.

### Affected Components

- src/workflow/scripts/task-fixture.mjs — fixture runner.

### Risk Assessment

**Priority**: LOW — no product code.

### Key Evidence

- src/workflow/scripts/task-fixture.mjs creates deterministic task artifacts.

## Test and Environment Orchestration

- **Detected Local Commands**: node src/workflow/scripts/task-gate.mjs ABC-0123 analysis
- **CI Jobs**: not found for fixture scope.
- **Frameworks**: Node.js script fixture.
- **Existing Test Locations**: src/workflow/scripts/task-fixture.mjs.
- **Environment Path**: local only.
- **Logs and Observability**: not found for fixture scope.
- **Manual Validation Paths**: none.
- **Coverage Gaps**: None for fixture scope.
- **Recommended New Tests**: None.

## Signals

No active signals.

## Validation Requests

- node src/workflow/scripts/task-gate.mjs ABC-0123 analysis

## Open Questions

None.

## Recommendations

### Primary Recommendation

- **Action**: Run all gates.
- **Rationale**: Proves script behavior.
- **Success Criteria**: All gates pass.

### Secondary Recommendations

None.
`);

await writeFile(path.join(taskDir, "plan.md"), `# Plan: ${taskId}

## Solution Overview

- **Approach**: Use fixture artifacts.
- **Alignment Rationale**: Exercises workflow gates.

## Solution Architecture

- **Design Approach**: Script-based validation.
- **Integration Strategy**: No integration.

## Implementation Phases

### Phase 1: Fixture

- **Objectives**: Create valid artifacts.
- **Technical Tasks**: Write task files.
- **Validation**: Run gate scripts.

## Quality Assurance

- **Testing Strategy**: npm script fixture.
- **Environment Validation Plan**: Local fixture only.
- **Coverage Plan**: Fixture covers task gate mechanics.
- **Success Criteria**: Gates pass.
- **Risk Mitigation**: Remove fixture after test.
- **Rollback Plan**: Delete tasks/${taskId}.

## Signals

No active signals.

## Implementation Checklist

- [x] [Phase 1 - Step]: Create fixture files.
- [x] [Phase 1 - Validation]: Run gate scripts.
- [x] Final integration validation.
`);

await writeFile(path.join(taskDir, "implementation.md"), `# ${taskId} Implementation

## Changes made

Created fixture task artifacts for validation only. No product code changed.

## Files changed

- src/workflow/tasks/${taskId}/analysis.md — fixture analysis.
- src/workflow/tasks/${taskId}/plan.md — fixture plan.
- src/workflow/tasks/${taskId}/implementation.md — fixture implementation.
- src/workflow/tasks/${taskId}/validation.md — fixture validation.

## Notes

Fixture is removed after test.
`);

await writeFile(path.join(taskDir, "validation.md"), `# ${taskId} Validation

## Commands run

- node src/workflow/scripts/task-gate.mjs ${taskId} analysis
- node src/workflow/scripts/task-gate.mjs ${taskId} plan
- node src/workflow/scripts/task-gate.mjs ${taskId} implementation
- node src/workflow/scripts/task-gate.mjs ${taskId} validation

## Results

All fixture gates are expected to pass.

## Manual checks

None.

## Remaining risks

None.
`);

for (const gate of ["analysis", "plan", "implementation", "validation"]) {
  run(["src/workflow/scripts/task-gate.mjs", taskId, gate]);
}

await rm(taskDir, { recursive: true, force: true });
console.log("Task fixture test passed.");
