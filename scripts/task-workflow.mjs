#!/usr/bin/env node
import { mkdir, readFile, writeFile, stat, rename } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scriptPath = path.resolve(process.argv[1] ?? "");
const defaultTasksRoot = scriptPath.includes(`${path.sep}.pi${path.sep}workflow${path.sep}`)
  ? path.join(root, ".pi", "workflow", "tasks")
  : path.join(root, "tasks");
const tasksRoot = process.env.PI_WORKFLOW_TASKS_DIR
  ? path.resolve(root, process.env.PI_WORKFLOW_TASKS_DIR)
  : defaultTasksRoot;
const taskIdPattern = /^[A-Z]+-[0-9]+$/;

function usage() {
  console.log(`Usage:
  node scripts/task-workflow.mjs init TASK-ID [title]
  node scripts/task-workflow.mjs validate TASK-ID
  node scripts/task-workflow.mjs status TASK-ID
  node scripts/task-workflow.mjs update TASK-ID "what changed"
  node scripts/task-workflow.mjs archive TASK-ID

Examples:
  node scripts/task-workflow.mjs init ABC-0123 "Fix login error"
  node scripts/task-workflow.mjs validate ABC-0123
  node scripts/task-workflow.mjs update ABC-0123 "Acceptance criteria changed"`);
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function assertTaskId(taskId) {
  if (!taskIdPattern.test(taskId)) {
    throw new Error(`Invalid task id "${taskId}". Expected pattern: ${taskIdPattern.source}`);
  }
}

function taskDir(taskId) {
  return path.join(tasksRoot, taskId);
}

function taskPath(taskId) {
  return path.relative(root, taskDir(taskId));
}

async function writeNew(filePath, content) {
  if (await exists(filePath)) return;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function initTask(taskId, title = "") {
  assertTaskId(taskId);
  const dir = taskDir(taskId);
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(dir, "context"), { recursive: true });
  await mkdir(path.join(dir, "analysis"), { recursive: true });
  await mkdir(path.join(dir, "validation"), { recursive: true });
  await mkdir(path.join(dir, "debugging"), { recursive: true });

  const displayTitle = title || taskId;
  await writeNew(path.join(dir, "README.md"), `# ${taskId} — ${displayTitle}\n\n## Purpose\n\nDescribe the task objective.\n\n## Source\n\n- System: Jira or project management tool\n- Ticket: ${taskId}\n- Title: ${displayTitle}\n\n## Workflow\n\n1. Analysis and discovery\n2. Planning\n3. Implementation\n4. Validation\n\n## Current state\n\nNot started.\n`);

  await writeNew(path.join(dir, "analysis.md"), `# ${taskId} Analysis and Discovery\n\n## Problem statement\n\n\n## Findings\n\n\n## Signals\n\n- Cross-repo: none known\n- External dependency: none known\n- Design decision: none known\n- Blocker risk: none known\n- Developer input needed: none known\n\n## Complexity\n\nUnclassified.\n\n## Open questions\n\n\n`);

  await writeNew(path.join(dir, "plan.md"), `# ${taskId} Plan\n\n## Approach\n\n\n## Checklist\n\n- [ ] Confirm scope\n- [ ] Implement changes\n- [ ] Validate behavior\n- [ ] Update documentation if needed\n\n## Risks\n\n\n## Rollback notes\n\n\n`);

  await writeNew(path.join(dir, "implementation.md"), `# ${taskId} Implementation\n\n## Changes made\n\n\n## Files changed\n\n\n## Notes\n\n\n`);

  await writeNew(path.join(dir, "validation.md"), `# ${taskId} Validation\n\n## Commands run\n\n\n## Results\n\n\n## Manual checks\n\n\n## Remaining risks\n\n\n`);

  await writeNew(path.join(dir, "context", ".gitkeep"), "");
  await writeNew(path.join(dir, "analysis", ".gitkeep"), "");
  await writeNew(path.join(dir, "validation", ".gitkeep"), "");
  await writeNew(path.join(dir, "debugging", ".gitkeep"), "");

  console.log(`Task workspace ready: ${taskPath(taskId)}`);
}

async function validateTask(taskId) {
  assertTaskId(taskId);
  const dir = taskDir(taskId);
  const required = ["README.md", "analysis.md", "plan.md", "implementation.md", "validation.md", "context", "analysis", "validation", "debugging"];
  const missing = [];

  for (const item of required) {
    if (!(await exists(path.join(dir, item)))) missing.push(item);
  }

  if (missing.length > 0) {
    throw new Error(`Task ${taskId} is missing: ${missing.join(", ")}`);
  }

  console.log(`Task workspace valid: ${taskPath(taskId)}`);
}

async function statusTask(taskId) {
  await validateTask(taskId);
  const dir = taskDir(taskId);
  const files = ["analysis.md", "plan.md", "implementation.md", "validation.md"];
  for (const file of files) {
    const content = await readFile(path.join(dir, file), "utf8");
    const filledLines = content.split("\n").filter((line) => line.trim() && !line.startsWith("#")).length;
    console.log(`${file}: ${filledLines} content lines`);
  }
}

async function updateTask(taskId, change = "") {
  await validateTask(taskId);
  const file = path.join(taskDir(taskId), "update.md");
  const now = new Date().toISOString();
  const entry = `\n## ${now}\n\n- **Change**: ${change || "Not specified"}\n- **Status**: Pending delta analysis\n`;
  const current = (await exists(file)) ? await readFile(file, "utf8") : `# Update: ${taskId}\n`;
  await writeFile(file, `${current.trimEnd()}\n${entry}`);
  console.log(`Task update recorded: tasks/${taskId}/update.md`);
}

async function archiveTask(taskId) {
  await validateTask(taskId);
  const source = taskDir(taskId);
  const target = path.join(tasksRoot, "archive", taskId);
  if (await exists(target)) throw new Error(`Archive already exists: ${path.relative(root, target)}`);
  await mkdir(path.dirname(target), { recursive: true });
  await rename(source, target);
  console.log(`Task archived: ${path.relative(root, target)}`);
}

const [command, taskId, ...titleParts] = process.argv.slice(2);

try {
  if (!command || !taskId) {
    usage();
    process.exit(1);
  }

  if (command === "init") await initTask(taskId, titleParts.join(" "));
  else if (command === "validate") await validateTask(taskId);
  else if (command === "status") await statusTask(taskId);
  else if (command === "update") await updateTask(taskId, titleParts.join(" "));
  else if (command === "archive") await archiveTask(taskId);
  else {
    usage();
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
