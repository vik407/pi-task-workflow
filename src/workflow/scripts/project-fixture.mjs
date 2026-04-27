#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const fixture = path.join(root, "fixtures", "sample-node-project");
const taskId = "FXT-0001";

function run(command, args, cwd = root, env = process.env) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false, env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("npm", ["test"], fixture);

for (const gate of ["analysis", "plan", "implementation", "validation"]) {
  run(process.execPath, [path.join(root, "src", "workflow", "scripts", "task-gate.mjs"), taskId, gate], fixture, {
    ...process.env,
    PI_WORKFLOW_TASKS_DIR: "tasks",
  });
}

console.log("Project fixture test passed.");
