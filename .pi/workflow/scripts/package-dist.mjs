#!/usr/bin/env node
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distRoot = path.join(root, "dist");
const distPi = path.join(distRoot, ".pi");

async function exists(filePath) {
  try { await stat(filePath); return true; } catch { return false; }
}

if (!(await exists(path.join(root, ".pi")))) {
  console.error("Missing .pi/. Run npm run sync first.");
  process.exit(1);
}

await rm(distRoot, { recursive: true, force: true });
await mkdir(distRoot, { recursive: true });
await cp(path.join(root, ".pi"), distPi, { recursive: true });

console.log("Distribution package ready: dist/.pi");
