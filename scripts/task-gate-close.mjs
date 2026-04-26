#!/usr/bin/env node
import { appendFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const [taskId, phase, ...reasonParts] = process.argv.slice(2);
const taskIdPattern = /^[A-Z]+-[0-9]+$/;
const validPhases = new Set(["analysis", "plan", "implementation", "validation"]);
const reason = reasonParts.join(" ").trim();

function usage() {
  console.log('Usage: node scripts/task-gate-close.mjs TASK-ID analysis|plan|implementation|validation "reason"');
}

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

if (!taskId || !phase || !reason || !taskIdPattern.test(taskId) || !validPhases.has(phase)) {
  usage();
  process.exit(1);
}

if (reason.length < 20) {
  console.error("Manual gate closure requires a clear reason of at least 20 characters.");
  process.exit(1);
}

const taskDir = path.join(root, "tasks", taskId);
if (!(await exists(taskDir))) {
  console.error(`Missing task workspace: tasks/${taskId}`);
  process.exit(1);
}

const file = path.join(taskDir, "gate-decisions.md");
const now = new Date().toISOString();
await mkdir(taskDir, { recursive: true });
await appendFile(file, `\n## ${now}\n\n- **Phase**: ${phase}\n- **Decision**: closed\n- **Reason**: ${reason}\n- **Closed by**: developer\n`);
console.log(`Manual gate closure recorded: tasks/${taskId}/gate-decisions.md`);
