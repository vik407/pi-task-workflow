#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const [command, projectKey = "default", ...valueParts] = process.argv.slice(2);
const dir = path.join(root, "tasks", "knowledge");
const file = path.join(dir, "project-patterns.md");

async function exists(p) { try { await stat(p); return true; } catch { return false; } }
async function ensureFile() {
  await mkdir(dir, { recursive: true });
  if (!(await exists(file))) {
    await writeFile(file, "# Project Patterns\n\nReusable knowledge learned from real work.\n");
  }
}
function sectionTitle(key) { return `## Project: ${key}`; }

await ensureFile();
const content = await readFile(file, "utf8");

if (command === "list") {
  const marker = sectionTitle(projectKey);
  const start = content.indexOf(marker);
  if (start === -1) {
    console.log(`No patterns recorded for project: ${projectKey}`);
    process.exit(0);
  }
  const next = content.indexOf("\n## Project: ", start + marker.length);
  console.log(content.slice(start, next === -1 ? content.length : next).trim());
  process.exit(0);
}

if (command === "add") {
  const value = valueParts.join(" ").trim();
  if (!value || value.length < 10) {
    console.error("Pattern text must be at least 10 characters.");
    process.exit(1);
  }
  const marker = sectionTitle(projectKey);
  let next = content;
  const entry = `\n- ${value}`;
  if (!content.includes(marker)) {
    next = `${content.trimEnd()}\n\n${marker}\n${entry}\n`;
  } else {
    next = content.replace(marker, `${marker}${entry}`);
  }
  await writeFile(file, next);
  console.log(`Pattern recorded for project: ${projectKey}`);
  process.exit(0);
}

console.log(`Usage:
  node scripts/patterns.mjs list PROJECT-KEY
  node scripts/patterns.mjs add PROJECT-KEY "pattern text"`);
process.exit(1);
