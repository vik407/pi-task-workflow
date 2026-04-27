#!/usr/bin/env node
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const srcDir = path.join(root, "src");
const piDir = path.join(root, ".pi");

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
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function copyPath(source, target) {
  if (!(await exists(source))) return;
  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
}

runValidation();

await mkdir(piDir, { recursive: true });
await copyPath(path.join(srcDir, "settings.json"), path.join(piDir, "settings.json"));

for (const directory of ["prompts", "skills", "extensions", "themes"]) {
  await copyPath(path.join(srcDir, directory), path.join(piDir, directory));
}

await copyPath(path.join(srcDir, "workflow"), path.join(piDir, "workflow"));

console.log("Synchronized src/ resources into .pi/.");
