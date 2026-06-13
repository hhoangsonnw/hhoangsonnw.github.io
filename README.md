# Cybersecurity Portfolio Maintenance Guide

This project is a static React + Vite portfolio for CTF and blue-team writeups. The site does not read Markdown directly from random folders. Published writeups must live under `content/`, and the generated files in `public/` must be refreshed before the browser can see new metadata, routes, images, RSS, or sitemap entries.

## Quick Start

```bash
npm install
npm run content:sync
npm run dev
```

The dev server prints a local URL, usually `http://localhost:5173`.

## Most Important Rule

After adding or editing any writeup, run:

```bash
npm run content:sync
```

This prevents stale content problems where the site shows an old placeholder, old difficulty, old description, missing image, or missing post.

The source of truth is:

```text
content/
```

The website reads generated runtime content from:

```text
public/content/
public/content-manifest.json
public/rss.xml
public/sitemap.xml
```

If `dist/` already exists, `npm run content:sync` also refreshes:

```text
dist/content/
dist/content-manifest.json
dist/rss.xml
dist/sitemap.xml
```

For GitHub Pages publishing, dependency updates, cleanup, and long-term upkeep, see [MAINTENANCE.md](MAINTENANCE.md).

## Project Layout

```text
.
├── content/                  # Source Markdown and writeup assets
│   ├── CyberDefenders/
│   ├── HTB/
│   │   ├── Challenges/
│   │   └── Sherlocks/
│   └── CTF competitions/
├── public/                   # Runtime static assets generated from content/
│   ├── content/
│   ├── content-manifest.json
│   ├── rss.xml
│   ├── sitemap.xml
│   └── _redirects
├── scripts/                  # Project utility scripts
│   ├── add-post.mjs
│   ├── copy-404.mjs
│   └── sync-content.mjs
├── src/                      # React app
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── pages/
├── dist/                     # Production build output
├── package.json
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

## NPM Commands

### Start Development

```bash
npm run dev
```

Runs `npm run content:sync` first, then starts Vite. Use this when writing locally.

### Build Production

```bash
npm run build
```

Runs the content sync, builds the Vite app into `dist/`, then creates `dist/404.html` for static SPA fallback.

### Preview Production Build

```bash
npm run preview
```

Serves the existing `dist/` folder locally. Run `npm run build` first if you want the latest production output.

### Sync Content

```bash
npm run content:sync
```

Copies `content/` into `public/content/`, regenerates `public/content-manifest.json`, `public/rss.xml`, and `public/sitemap.xml`, and updates existing `dist/` content artifacts if `dist/index.html` exists.

Use this after:

- adding a new writeup
- editing frontmatter
- changing difficulty
- changing tags
- changing dates
- replacing screenshots
- moving a writeup folder
- deleting a writeup

### Add A New Post

```bash
npm run content:add -- --branch CyberDefenders --folder --title "Challenge Name" --difficulty medium --category forensics --tags forensics,malware
```

This creates a writeup folder and a starter `WRITEUP.md`, then runs the content sync.

## Writeup Workflow

### Recommended Workflow For CyberDefenders

```bash
npm run content:add -- --branch CyberDefenders --folder --title "BlueSky Ransomware" --difficulty medium --category forensics --tags forensics,ransomware,malware,windows
```

Then edit the generated file:

```text
content/CyberDefenders/bluesky-ransomware/WRITEUP.md
```

Put screenshots in the same folder:

```text
content/CyberDefenders/bluesky-ransomware/
├── WRITEUP.md
├── image.png
├── image-1.png
└── image-2.png
```

Reference images with relative Markdown paths:

```markdown
![IPv4 Statistics](image.png)
![PowerShell evidence](image-1.png)
```

When finished:

```bash
npm run content:sync
npm run build
```

### Avoid This Mistake

Do not leave the real writeup only in a top-level folder such as:

```text
BlueSkyRansomWare/WRITEUP.md
```

The web app does not publish arbitrary top-level folders. Move or copy the writeup into the correct `content/` branch folder, then run:

```bash
npm run content:sync
```

## Valid Content Branches

```text
content/CyberDefenders/*             -> /cyberdefenders
content/HTB/Sherlocks/*              -> /htb/sherlocks
content/HTB/Challenges/*             -> /htb/challenges
content/CTF competitions/*           -> /ctf-competitions
```

Valid `--branch` values:

```text
CyberDefenders
HTB/Sherlocks
HTB/Challenges
HTB
CTF competitions
```

For HTB, either pass the sub-branch in `--branch`:

```bash
npm run content:add -- --branch HTB/Sherlocks --title "Case Name" --type writeup --tags forensics,windows
```

Or pass it through `--section`:

```bash
npm run content:add -- --branch HTB --section Challenges --title "Crypto Casino" --type writeup --tags crypto
```

## Frontmatter Reference

Every writeup should start with YAML frontmatter:

```yaml
---
title: "BlueSky Ransomware"
description: "CyberDefenders write-up investigating SQL Server compromise, PowerShell C2 staging, and ransomware deployment."
date: "2026-06-11"
type: "writeup"
branch: "CyberDefenders"
category: "forensics"
tags: ["forensics", "ransomware", "malware", "windows"]
difficulty: "medium"
featured: false
---
```

Common fields:

- `title`: Display title.
- `description`: Card and SEO summary.
- `date`: Publish date in `YYYY-MM-DD` format.
- `updated`: Optional update date in `YYYY-MM-DD` format.
- `type`: Usually `writeup`; `blog` is also supported.
- `branch`: Display branch name.
- `subBranch`: Optional, used for HTB sub-branches.
- `category`: Main category label.
- `tags`: Array or comma-separated list.
- `difficulty`: Challenge difficulty such as `easy`, `medium`, `hard`, or `insane`.
- `featured`: `true` or `false`.
- `draft`: Set to `true` to keep a Markdown file out of the manifest.
- `cover`: Optional image path relative to the writeup folder.
- `slug`: Optional custom route slug.

## Utility Scripts

### `scripts/add-post.mjs`

Creates a new Markdown post in the selected branch. It supports:

```text
--title       Required post title
--branch      HTB/Sherlocks, HTB/Challenges, CyberDefenders, or "CTF competitions"
--section     Optional sub-branch for HTB
--type        writeup or blog
--category    Frontmatter category
--tags        Comma-separated tags
--difficulty  Difficulty label
--folder      Create content/<branch>/<slug>/WRITEUP.md for image-heavy posts
--slug        Optional custom slug
```

Examples:

```bash
npm run content:add -- --branch CyberDefenders --folder --title "Spotted In The Wild" --difficulty hard --category forensics --tags forensics,malware,windows
npm run content:add -- --branch HTB/Sherlocks --title "Bumblebee" --type writeup --tags forensics,windows
npm run content:add -- --branch "CTF competitions" --title "Finals Crypto" --type writeup --tags crypto,ctf
```

### `scripts/sync-content.mjs`

Publishes source content into runtime static files. It:

- creates missing branch directories under `content/`
- copies `content/` to `public/content/`
- skips hidden files and folders
- parses Markdown frontmatter with `gray-matter`
- generates `public/content-manifest.json`
- generates `public/rss.xml`
- generates `public/sitemap.xml`
- updates existing `dist/` content artifacts when possible

Direct command:

```bash
node scripts/sync-content.mjs
```

Build-only command that skips `dist/` artifact syncing before Vite rebuilds:

```bash
node scripts/sync-content.mjs --no-dist
```

### `scripts/copy-404.mjs`

Copies `dist/index.html` to `dist/404.html` after a production build. This lets static hosts serve deep React routes such as `/cyberdefenders/bluesky-ransomware`.

Direct command:

```bash
node scripts/copy-404.mjs
```

## How The App Loads Content

The React app fetches:

```text
public/content-manifest.json
```

Each post in that manifest points to a Markdown file under:

```text
public/content/
```

That means React code usually does not need to change when adding writeups. Keep `content/` correct, then run `npm run content:sync`.

## Maintenance Checklist

Before publishing:

```bash
npm run content:sync
npm run build
```

Then verify the generated manifest:

```bash
node -e "const m=require('./public/content-manifest.json'); for (const p of m.posts) console.log([p.title,p.url,p.difficulty,p.readingTime.text,p.sourcePath].join(' | '))"
```

Useful checks:

```bash
find content -maxdepth 4 -type f -name '*.md' | sort
rg -n '^title:|^difficulty:|^draft:' content
rg -n 'Short summary|Add the target context|nmap -sV' content public/content dist/content
```

The last command helps catch starter template text that accidentally made it into a real writeup.

## Troubleshooting

### New writeup does not show on the website

Run:

```bash
npm run content:sync
```

Then hard refresh the browser. If it still does not show, check that the Markdown file is under `content/`, not a top-level folder.

### The page route exists, but it shows placeholder text

The generated manifest or public content is stale, or the placeholder file in `content/` was never replaced.

Check:

```bash
sed -n '1,40p' content/CyberDefenders/challenge-name/WRITEUP.md
sed -n '1,40p' public/content/CyberDefenders/challenge-name/WRITEUP.md
npm run content:sync
```

### Difficulty or tags are wrong

Edit frontmatter in the source Markdown file under `content/`, then run:

```bash
npm run content:sync
```

### Images do not load

Make sure images are in the same folder as `WRITEUP.md` or use the correct relative path.

Good:

```markdown
![Screenshot](image.png)
![Evidence](screenshots/evidence.png)
```

Bad:

```markdown
![Screenshot](/Users/name/Desktop/image.png)
```

### A draft should not publish

Add this to frontmatter:

```yaml
draft: true
```

Then run:

```bash
npm run content:sync
```

## Deployment

### Vercel

Use:

```text
Build command: npm run build
Output directory: dist
```

`vercel.json` rewrites all routes to `index.html`.

### Static Hosts And GitHub Pages

Build with:

```bash
npm run build
```

Deploy the `dist/` folder.

The generated `dist/404.html` supports direct navigation to nested React routes on static hosts.

If the site is hosted under a repository path, set:

```bash
VITE_BASE_PATH=/repository-name/ npm run build
```

For correct RSS and sitemap URLs, set:

```bash
SITE_URL=https://username.github.io/repository-name npm run build
```

Optional profile links:

```bash
VITE_GITHUB_URL=https://github.com/your-handle npm run build
VITE_LINKEDIN_URL=https://www.linkedin.com/in/your-profile/ npm run build
```

## Environment Variables

```text
VITE_BASE_PATH     Base path for Vite routes and assets. Defaults to /
SITE_TITLE         RSS and sitemap site title. Defaults to HHOANGSONNW
SITE_DESCRIPTION   RSS and sitemap description.
SITE_URL           Absolute site URL for RSS and sitemap links.
VITE_GITHUB_URL    Optional GitHub profile URL used by the UI.
VITE_LINKEDIN_URL  Optional LinkedIn profile URL used by the UI.
```

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS
- Framer Motion
- React Router
- React Markdown
- remark-gfm
- rehype-slug
- highlight.js
- gray-matter
