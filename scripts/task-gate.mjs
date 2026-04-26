#!/usr/bin/env node
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const taskIdPattern = /^[A-Z]+-[0-9]+$/;
const [taskId, gate] = process.argv.slice(2);
const validGates = new Set(["analysis", "plan", "implementation", "validation"]);
const errors = [];

function usage() {
  console.log("Usage: node scripts/task-gate.mjs TASK-ID analysis|plan|implementation|validation");
}

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

async function readTaskFile(name) {
  const file = path.join(root, "tasks", taskId, name);
  if (!(await exists(file))) {
    errors.push(`Missing tasks/${taskId}/${name}`);
    return "";
  }
  return readFile(file, "utf8");
}

async function hasManualClosure() {
  const file = path.join(root, "tasks", taskId, "gate-decisions.md");
  if (!(await exists(file))) return false;
  const content = await readFile(file, "utf8");
  const phasePattern = new RegExp(`- \\*\\*Phase\\*\\*: ${gate}([\\s\\S]*?)- \\*\\*Decision\\*\\*: closed`, "i");
  return phasePattern.test(content);
}

function requireIncludes(content, labels, file) {
  for (const label of labels) {
    if (!content.includes(label)) errors.push(`${file} missing required section: ${label}`);
  }
}

function requireEvidence(content, file) {
  const hasPath = /[`\s][\w./-]+\.(js|ts|tsx|jsx|json|md|yml|yaml|css|html|py|sh|mjs|cjs)(:\d+)?/.test(content);
  const hasEvidenceWords = /evidence|finding|root cause|affected component/i.test(content);
  if (!hasPath || !hasEvidenceWords) errors.push(`${file} needs concrete evidence with file paths and findings.`);
}

function requireNonEmptyAfter(content, heading, file) {
  const idx = content.indexOf(heading);
  if (idx === -1) return;
  const next = content.indexOf("\n## ", idx + heading.length);
  const body = content.slice(idx + heading.length, next === -1 ? content.length : next).trim();
  if (body.length < 20) errors.push(`${file} section ${heading} is too thin.`);
}

async function gateAnalysis() {
  const file = "analysis.md";
  const content = await readTaskFile(file);
  requireIncludes(content, ["## Executive Summary", "## Complexity Classification", "## Technical Investigation", "## Test and Environment Orchestration", "## Signals", "## Validation Requests", "## Open Questions", "## Recommendations"], file);
  if (!/\*\*Level\*\*:\s*(SIMPLE|COMPLEX)/.test(content)) errors.push(`${file} must classify Level as SIMPLE or COMPLEX.`);
  if (!/\*\*Confidence\*\*:\s*(HIGH|MEDIUM|LOW)/.test(content)) errors.push(`${file} must classify Confidence as HIGH, MEDIUM, or LOW.`);
  requireEvidence(content, file);
  requireNonEmptyAfter(content, "## Executive Summary", file);
  requireNonEmptyAfter(content, "## Test and Environment Orchestration", file);
}

async function gatePlan() {
  const file = "plan.md";
  const content = await readTaskFile(file);
  await readTaskFile("analysis.md");
  requireIncludes(content, ["## Solution Overview", "## Solution Architecture", "## Implementation Phases", "## Quality Assurance", "## Implementation Checklist"], file);
  if (!/(Coverage Plan|Testing Strategy|Environment Validation Plan)/i.test(content)) errors.push(`${file} must include testing strategy, environment validation plan, or coverage plan.`);
  if (!/- \[ \] .+/.test(content) && !/- \[x\] .+/i.test(content)) errors.push(`${file} must include checklist items.`);
  requireNonEmptyAfter(content, "## Solution Overview", file);
}

async function gateImplementation() {
  const file = "implementation.md";
  const content = await readTaskFile(file);
  await readTaskFile("analysis.md");
  await readTaskFile("plan.md");
  requireIncludes(content, ["## Changes made", "## Files changed"], file);
  requireNonEmptyAfter(content, "## Changes made", file);
  if (!/(changed|updated|created|removed|none|not implemented)/i.test(content)) errors.push(`${file} must state what changed or why nothing changed.`);
}

async function gateValidation() {
  const file = "validation.md";
  const content = await readTaskFile(file);
  await readTaskFile("implementation.md");
  requireIncludes(content, ["## Commands run", "## Results", "## Remaining risks"], file);
  requireNonEmptyAfter(content, "## Results", file);
  if (!/(npm|node|python|pytest|test|lint|typecheck|coverage|playwright|cypress|vitest|jest|manual|logs|staging|production|development|dev environment|smoke|not run|skipped)/i.test(content)) errors.push(`${file} must record real commands, environment checks, manual checks, or explicit skips.`);
  if (/not run|skipped/i.test(content) && !/reason|because|blocked|not available/i.test(content)) errors.push(`${file} must explain why validation was skipped or not run.`);
}

if (!taskId || !gate || !validGates.has(gate)) {
  usage();
  process.exit(1);
}
if (!taskIdPattern.test(taskId)) {
  console.error(`Invalid task id: ${taskId}`);
  process.exit(1);
}

if (gate === "analysis") await gateAnalysis();
if (gate === "plan") await gatePlan();
if (gate === "implementation") await gateImplementation();
if (gate === "validation") await gateValidation();

if (errors.length) {
  if (await hasManualClosure()) {
    console.warn(`Task gate manually closed: ${taskId} ${gate}\n`);
    console.warn("Accepted unresolved gate findings:");
    for (const error of errors) console.warn(`- ${error}`);
    process.exit(0);
  }
  console.error(`Task gate failed: ${taskId} ${gate}\n`);
  for (const error of errors) console.error(`- ${error}`);
  console.error(`\nTo accept the risk manually, the developer may run:`);
  console.error(`npm run task:gate:close -- ${taskId} ${gate} "reason for accepting open questions"`);
  process.exit(1);
}

console.log(`Task gate passed: ${taskId} ${gate}`);
