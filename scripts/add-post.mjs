import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { contentBranches, getContentTargetByInput } from '../src/lib/branches.js';

const rootDir = process.cwd();

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    result[key] = next && !next.startsWith('--') ? next : true;
    if (result[key] === next) index += 1;
  }
  return result;
}

function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=[\]{};:'"\\|,.<>/?]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function runSync() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/sync-content.mjs'], {
      cwd: rootDir,
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`content sync exited with code ${code}`));
    });
  });
}

const args = parseArgs(process.argv.slice(2));
const target = getContentTargetByInput(args.branch || 'CyberDefenders', args.section || args.subbranch);

if (!args.title) {
  console.log(`Usage:
  npm run content:add -- --branch HTB/Sherlocks --title "Bumblebee" --type writeup --tags forensics,windows
  npm run content:add -- --branch HTB --section Challenges --title "Crypto Casino" --type writeup --tags crypto
  npm run content:add -- --branch CyberDefenders --folder --title "Spotted In The Wild" --category forensics --tags forensics,malware,windows
  npm run content:add -- --branch "CTF competitions" --title "Finals Crypto" --type blog --tags crypto,ctf

Options:
  --title       Required post title
  --branch      HTB/Sherlocks, HTB/Challenges, CyberDefenders, or "CTF competitions"; defaults to CyberDefenders
  --section     Optional sub-branch for HTB, e.g. Sherlocks or Challenges
  --type        writeup or blog, defaults to writeup
  --category    Frontmatter category, defaults to selected branch/sub-branch name
  --tags        Comma-separated tag list
  --difficulty  Optional CTF difficulty label
  --folder      Create content/<branch>/<slug>/WRITEUP.md for image-heavy posts
`);
  process.exit(0);
}

if (!target) {
  const validTargets = contentBranches.flatMap((branch) => [
    branch.name,
    ...(branch.subBranches?.map((subBranch) => `${branch.name}/${subBranch.name}`) ?? []),
  ]);
  console.error(`Unknown branch "${args.branch}". Use one of: ${validTargets.join(', ')}`);
  process.exit(1);
}

const { branch, subBranch } = target;
const type = args.type === 'blog' ? 'blog' : 'writeup';
const slug = slugify(args.slug || args.title);
const useFolderPost = args.folder === true || args.folder === 'true';
const collectionDir = path.join(rootDir, 'content', branch.directory, subBranch?.directory || '');
const targetDir = useFolderPost ? path.join(collectionDir, slug) : collectionDir;
const targetFile = useFolderPost ? path.join(targetDir, 'WRITEUP.md') : path.join(targetDir, `${slug}.md`);
const today = new Date().toISOString().slice(0, 10);
const tags = args.tags ? `[${String(args.tags).split(',').map((tag) => `"${tag.trim()}"`).join(', ')}]` : '[]';

const template = `---
title: "${String(args.title).replace(/"/g, '\\"')}"
description: "Short summary of the finding, path, or lab objective."
date: "${today}"
type: "${type}"
branch: "${branch.name}"
${subBranch ? `subBranch: "${subBranch.name}"\n` : ''}category: "${args.category || subBranch?.name || branch.name}"
tags: ${tags}
difficulty: "${args.difficulty || ''}"
featured: false
---

## Overview

Add the target context, scope, and the initial hypothesis.

${useFolderPost ? '![Evidence screenshot](image.png)\n' : ''}

## Enumeration

\`\`\`bash
nmap -sV -sC target.local
\`\`\`

## Exploitation

Document the primitive, payload, and proof.

## Lessons

- What signal mattered?
- What would you automate next?
`;

await fs.mkdir(targetDir, { recursive: true });

try {
  await fs.writeFile(targetFile, template, { flag: 'wx' });
} catch (error) {
  if (error.code === 'EEXIST') {
    console.error(`Refusing to overwrite existing file: ${path.relative(rootDir, targetFile)}`);
    process.exit(1);
  }
  throw error;
}

console.log(`Created ${path.relative(rootDir, targetFile)}`);
await runSync();
