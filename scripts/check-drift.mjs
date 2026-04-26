#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pairs = [
  ["src/settings.json", ".pi/settings.json"],
  ["src/prompts", ".pi/prompts"],
  ["src/skills", ".pi/skills"],
  ["src/extensions", ".pi/extensions"],
  ["src/themes", ".pi/themes"],
];
const errors = [];

async function exists(file) { try { await stat(file); return true; } catch { return false; } }
async function isDir(file) { try { return (await stat(file)).isDirectory(); } catch { return false; } }

async function listFiles(base) {
  if (!(await exists(base))) return [];
  if (!(await isDir(base))) return [base];
  const entries = await readdir(base, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(base, entry.name);
    if (entry.isDirectory()) out.push(...await listFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

for (const [src, dst] of pairs) {
  const srcPath = path.join(root, src);
  const dstPath = path.join(root, dst);
  if (!(await exists(srcPath))) errors.push(`Missing ${src}`);
  if (!(await exists(dstPath))) errors.push(`Missing ${dst}`);
  const srcFiles = await listFiles(srcPath);
  const dstFiles = await listFiles(dstPath);
  const srcRel = new Set(srcFiles.map(f => path.relative(srcPath, f)));
  const dstRel = new Set(dstFiles.map(f => path.relative(dstPath, f)));
  for (const rel of srcRel) {
    if (!dstRel.has(rel)) { errors.push(`Missing generated file ${path.join(dst, rel)}`); continue; }
    const a = await readFile(path.join(srcPath, rel), "utf8");
    const b = await readFile(path.join(dstPath, rel), "utf8");
    if (a !== b) errors.push(`Drift detected: ${path.join(dst, rel)} differs from ${path.join(src, rel)}`);
  }
  for (const rel of dstRel) if (!srcRel.has(rel)) errors.push(`Generated file has no source: ${path.join(dst, rel)}`);
}

if (errors.length) {
  console.error("Drift check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Drift check passed.");
