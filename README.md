# hhoangsonnw.github.io

Personal cybersecurity website for publishing CTF write-ups, forensic notes, malware-analysis walkthroughs, and security lab documentation.

The site is built as a static single-page application and deployed with GitHub Pages at:

```text
https://hhoangsonnw.github.io
```

## Stack

- React
- Vite
- JavaScript
- HTML
- CSS
- Tailwind CSS
- Markdown content
- GitHub Pages
- GitHub Actions

## Content

Write-ups are organized by platform and category, including:

- Hack The Box Challenges
- Hack The Box Sherlocks
- CyberDefenders
- CTF competitions

Markdown files and screenshots live under `content/`, then project scripts generate the static public content manifest used by the React app.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

For publishing workflow and future maintenance notes, see [MAINTENANCE.md](MAINTENANCE.md).
