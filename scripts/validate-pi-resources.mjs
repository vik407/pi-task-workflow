#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");
const errors = [];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(root, filePath)} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) return {};
  const end = markdown.indexOf("\n---", 4);
  if (end === -1) return {};
  const yaml = markdown.slice(4, end).trim();
  const result = {};
  for (const line of yaml.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    result[key] = rawValue.replace(/^['\"]|['\"]$/g, "");
  }
  return result;
}

async function listFiles(dir, recursive = false) {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      files.push(...(await listFiles(fullPath, true)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function validateSettings() {
  const settingsPath = path.join(srcDir, "settings.json");
  if (!(await exists(settingsPath))) {
    errors.push("src/settings.json is required.");
    return;
  }
  const settings = await readJson(settingsPath);
  if (!settings) return;

  if (settings.sessionDir && settings.sessionDir !== ".pi/sessions") {
    errors.push('src/settings.json should keep "sessionDir" set to ".pi/sessions" for project-local sessions.');
  }
}

async function validatePackageManifest() {
  const packageJson = await readJson(path.join(root, "package.json"));
  if (!packageJson) return;

  const expected = {
    extensions: ["./.pi/extensions"],
    skills: ["./.pi/skills"],
    prompts: ["./.pi/prompts"],
    themes: ["./.pi/themes"],
  };

  for (const [key, value] of Object.entries(expected)) {
    const actual = packageJson.pi?.[key];
    if (JSON.stringify(actual) !== JSON.stringify(value)) {
      errors.push(`package.json pi.${key} must be ${JSON.stringify(value)}.`);
    }
  }
}

async function validatePrompts() {
  const promptDir = path.join(srcDir, "prompts");
  const files = (await listFiles(promptDir)).filter((file) => file.endsWith(".md"));
  const names = new Set();
  const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const file of files) {
    const name = path.basename(file, ".md");
    const relative = path.relative(root, file);
    const markdown = await readFile(file, "utf8");
    const frontmatter = parseFrontmatter(markdown);

    if (names.has(name)) errors.push(`Duplicate prompt name: ${name}.`);
    names.add(name);

    if (!namePattern.test(name)) {
      errors.push(`${relative} filename must use lowercase letters, numbers, and single hyphens only.`);
    }
    if (!markdown.startsWith("---\n")) {
      errors.push(`${relative} must start with frontmatter.`);
    }
    if (!frontmatter.description) {
      errors.push(`${relative} should define a frontmatter description.`);
    } else if (frontmatter.description.length > 160) {
      errors.push(`${relative} description should be 160 characters or fewer.`);
    }
    if (frontmatter["argument-hint"] && !/^\".*\"$|^'.*'$|^[<\[].*[>\]]/.test(frontmatter["argument-hint"])) {
      errors.push(`${relative} argument-hint should be quoted or use <required>/[optional] notation.`);
    }
  }
}

async function validateSkills() {
  const skillDir = path.join(srcDir, "skills");
  const files = (await listFiles(skillDir, true)).filter((file) => path.basename(file) === "SKILL.md");
  const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const file of files) {
    const parentName = path.basename(path.dirname(file));
    const markdown = await readFile(file, "utf8");
    const frontmatter = parseFrontmatter(markdown);

    if (!frontmatter.name) {
      errors.push(`${path.relative(root, file)} must define frontmatter field "name".`);
    } else {
      if (frontmatter.name !== parentName) {
        errors.push(`${path.relative(root, file)} frontmatter name must match parent directory "${parentName}".`);
      }
      if (!namePattern.test(frontmatter.name)) {
        errors.push(`${path.relative(root, file)} name must use lowercase letters, numbers, and single hyphens only.`);
      }
      if (frontmatter.name.length > 64) {
        errors.push(`${path.relative(root, file)} name must be 64 characters or fewer.`);
      }
    }

    if (!frontmatter.description) {
      errors.push(`${path.relative(root, file)} must define frontmatter field "description".`);
    } else if (frontmatter.description.length > 1024) {
      errors.push(`${path.relative(root, file)} description must be 1024 characters or fewer.`);
    }
  }
}

async function validateExtensions() {
  const extensionDir = path.join(srcDir, "extensions");
  const files = (await listFiles(extensionDir, true)).filter((file) => !path.basename(file).startsWith("."));
  for (const file of files) {
    if (!file.endsWith(".ts") && !file.endsWith(".js")) {
      errors.push(`${path.relative(root, file)} must be a .ts or .js extension file.`);
    }
  }
}

async function validateThemes() {
  const themeDir = path.join(srcDir, "themes");
  const files = (await listFiles(themeDir, true)).filter((file) => !path.basename(file).startsWith("."));
  for (const file of files) {
    if (!file.endsWith(".json")) {
      errors.push(`${path.relative(root, file)} must be a .json theme file.`);
      continue;
    }
    await readJson(file);
  }
}

await validateSettings();
await validatePackageManifest();
await validatePrompts();
await validateSkills();
await validateExtensions();
await validateThemes();

if (errors.length > 0) {
  console.error("Pi resource validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Pi resource validation passed.");
