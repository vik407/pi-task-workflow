#!/usr/bin/env node
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

// ── CLI ──────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { target: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--target" && argv[i + 1]) {
      args.target = path.resolve(argv[++i]);
    }
  }
  return args;
}

function usage() {
  console.log(`Usage:
  node sync-pi-resources.mjs              Sync src/ → .pi/ (local)
  node sync-pi-resources.mjs --target /p   Sync src/ → /p/.pi/ (deploy)

Options:
  --target <path>    Deploy .pi/ into an external project directory.
                     Runtime files (tasks, sessions, knowledge) are preserved.`);
}

const { target } = parseArgs(process.argv);
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  usage();
  process.exit(0);
}

// ── Paths ────────────────────────────────────────────────────────────────────
const sourceRoot = process.cwd();
const targetRoot = target ?? sourceRoot;
const srcDir = path.join(sourceRoot, "src");
const piDir = path.join(targetRoot, ".pi");

// ── Protected paths (never overwrite if they already exist) ──────────────────
// These are runtime-generated files that grow organically.
// Source-controlled versions are seeds only; once deployed, the target owns them.
const PROTECTED_RELATIVE = new Set([
  "workflow/tasks/lessons.md",
  "workflow/tasks/knowledge/project-patterns.md",
]);

const PROTECTED_DIRS = new Set([
  "workflow/tasks",
  "sessions",
]);

const TASK_ID_PATTERN = /^[A-Z]+-[0-9]+$/;

// ── Helpers ──────────────────────────────────────────────────────────────────
async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function runValidation() {
  const result = spawnSync(process.execPath, ["src/workflow/scripts/validate-pi-resources.mjs"], {
    cwd: sourceRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

/**
 * Check whether a relative path falls under a protected directory or
 * is a protected file. Protected content is never overwritten.
 */
function isProtected(relPath) {
  // Exact match on protected files
  if (PROTECTED_RELATIVE.has(relPath)) return true;

  // Anything nested under a protected directory
  for (const dir of PROTECTED_DIRS) {
    if (relPath === dir || relPath.startsWith(dir + path.sep)) return true;
  }

  return false;
}

/**
 * Smart merge: walk the source tree and copy files individually.
 * - Source-controlled files (prompts, skills, scripts, etc.) are overwritten
 *   so bug fixes and updates propagate.
 * - Runtime-generated content (tasks, sessions, knowledge, lessons) is
 *   skipped entirely — never overwritten, never deleted.
 * - Task directories matching the TASK-ID pattern are always skipped.
 */
async function smartMerge(srcBase, dstBase, relDir = "") {
  if (!(await exists(srcBase))) return;

  const entries = await readdir(srcBase, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = path.join(relDir, entry.name);

    // ── Skip task directories (e.g. ABC-0123) entirely ──
    if (entry.isDirectory() && TASK_ID_PATTERN.test(entry.name)) continue;

    // ── Skip protected content ──
    if (isProtected(relPath)) continue;

    const srcPath = path.join(srcBase, entry.name);
    const dstPath = path.join(dstBase, entry.name);

    if (entry.isDirectory()) {
      await mkdir(dstPath, { recursive: true });
      await smartMerge(srcPath, dstPath, relPath);
    } else {
      // Ensure parent directory exists (first deploy may have no .pi/ yet)
      await mkdir(path.dirname(dstPath), { recursive: true });
      await cp(srcPath, dstPath, { force: true });
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
runValidation();

await mkdir(piDir, { recursive: true });

// Source-controlled file (overwrite always — it is the distribution truth)
await mkdir(path.dirname(path.join(piDir, "settings.json")), { recursive: true });
await cp(path.join(srcDir, "settings.json"), path.join(piDir, "settings.json"), { force: true });

// Source-controlled directories (smart merge preserves runtime content)
for (const directory of ["prompts", "skills", "extensions", "themes", "workflow"]) {
  await smartMerge(path.join(srcDir, directory), path.join(piDir, directory), directory);
}

const label = targetRoot === sourceRoot ? ".pi/" : `${piDir}`;
console.log(`Synced src/ → ${label}`);
if (target) console.log(`  Target: ${targetRoot}`);