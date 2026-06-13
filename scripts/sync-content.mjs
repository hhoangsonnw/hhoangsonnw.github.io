import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { contentBranches, getBranchByDirectory, getBranchRoutes, getSubBranchByDirectory } from '../src/lib/branches.js';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content');
const publicContentDir = path.join(rootDir, 'public', 'content');
const distDir = path.join(rootDir, 'dist');
const distContentDir = path.join(distDir, 'content');
const manifestPath = path.join(rootDir, 'public', 'content-manifest.json');
const rssPath = path.join(rootDir, 'public', 'rss.xml');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const shouldSyncDist = !process.argv.includes('--no-dist');

const site = {
  title: process.env.SITE_TITLE || 'HHOANGSONNW',
  description:
    process.env.SITE_DESCRIPTION ||
    'Personal cybersecurity portfolio with CTF write-ups, research notes, and reproducible security labs.',
  url: (process.env.SITE_URL || 'https://example.com').replace(/\/$/, ''),
};

const folderIndexNames = new Set(['index', 'readme', 'writeup']);

function toPosix(value) {
  return value.split(path.sep).join('/');
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

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateString(value, fallback = new Date()) {
  if (!value) return fallback.toISOString().slice(0, 10);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback.toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]*?---\s*/, '');
}

function humanize(value = '') {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEntryName(relativePath, minimumFolderDepth = 2) {
  const parts = toPosix(relativePath).split('/');
  const filename = parts.at(-1);
  const basename = path.posix.basename(filename, path.posix.extname(filename));

  if (folderIndexNames.has(basename.toLowerCase()) && parts.length > minimumFolderDepth) {
    return parts.at(-2);
  }

  return basename;
}

function firstHeading(markdown) {
  const match = stripFrontmatter(markdown).match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

function summaryFromMarkdown(markdown) {
  const body = stripFrontmatter(markdown)
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n{2,}/)
    .map((block) =>
      block
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/!\[[^\]]*]\([^)]+\)/g, '')
        .replace(/\[[^\]]+]\([^)]+\)/g, '')
        .replace(/[*_`>#-]/g, '')
        .trim(),
    )
    .find((block) => block.length > 40);

  if (!body) return undefined;
  return body.length > 180 ? `${body.slice(0, 177).trim()}...` : body;
}

function isRemoteOrRooted(value = '') {
  return /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(value);
}

function resolveContentAsset(assetBasePath, value) {
  if (!value || isRemoteOrRooted(value)) return value || undefined;
  return `${assetBasePath}/${value}`.replace(/\/{2,}/g, '/');
}

function isHiddenPath(filePath) {
  return toPosix(path.relative(contentDir, filePath))
    .split('/')
    .some((part) => part.startsWith('.'));
}

function readingTime(markdown) {
  const words = markdown
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return {
    minutes,
    words,
    text: `${minutes} min read`,
  };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.filter((entry) => !entry.name.startsWith('.')).map((entry) => {
      const resolved = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(resolved) : resolved;
    }),
  );

  return files.flat().filter((file) => file.endsWith('.md'));
}

function routeFor(branch, slug, subBranch) {
  return `${subBranch?.route || branch.route}/${slug}`;
}

function xmlEscape(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderRss(posts) {
  const items = posts
    .slice(0, 20)
    .map((post) => {
      const link = `${site.url}${post.url}`;
      return `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <description>${xmlEscape(post.description)}</description>
      <link>${xmlEscape(link)}</link>
      <guid>${xmlEscape(link)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${(post.tags || []).map((tag) => `<category>${xmlEscape(tag)}</category>`).join('')}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(site.title)}</title>
    <description>${xmlEscape(site.description)}</description>
    <link>${xmlEscape(site.url)}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`;
}

function renderSitemap(posts) {
  const routes = ['/', ...getBranchRoutes(), ...posts.map((post) => post.url)];
  const urls = routes
    .map(
      (route) => `
  <url>
    <loc>${xmlEscape(`${site.url}${route}`)}</loc>
  </url>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function syncDistArtifacts() {
  if (!(await exists(path.join(distDir, 'index.html')))) return false;

  await fs.rm(distContentDir, { recursive: true, force: true });
  await fs.cp(publicContentDir, distContentDir, { recursive: true });
  await fs.copyFile(manifestPath, path.join(distDir, 'content-manifest.json'));
  await fs.copyFile(rssPath, path.join(distDir, 'rss.xml'));
  await fs.copyFile(sitemapPath, path.join(distDir, 'sitemap.xml'));

  return true;
}

async function sync() {
  await fs.mkdir(contentDir, { recursive: true });
  await Promise.all(
    contentBranches.flatMap((branch) => [
      fs.mkdir(path.join(contentDir, branch.directory), { recursive: true }),
      ...(branch.subBranches?.map((subBranch) => fs.mkdir(path.join(contentDir, branch.directory, subBranch.directory), { recursive: true })) ?? []),
    ]),
  );
  await fs.rm(publicContentDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(publicContentDir), { recursive: true });
  await fs.cp(contentDir, publicContentDir, {
    recursive: true,
    filter: (source) => !isHiddenPath(source),
  });

  const files = await walk(contentDir);
  const posts = [];

  for (const file of files) {
    const stats = await fs.stat(file);
    const raw = await fs.readFile(file, 'utf8');
    const parsed = matter(raw);
    const relativePath = path.relative(contentDir, file);
    const publicRelativePath = toPosix(relativePath);
    const pathParts = publicRelativePath.split('/');
    const collection = pathParts[0];
    const branch = getBranchByDirectory(collection);
    if (!branch) continue;

    const subBranch = getSubBranchByDirectory(branch, pathParts[1]);
    const entryName = getEntryName(relativePath, subBranch ? 3 : 2);
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(humanize(entryName));
    const type = parsed.data.type || 'writeup';
    const title = parsed.data.title || firstHeading(raw) || humanize(entryName);
    const assetBasePath = `/content/${toPosix(path.dirname(relativePath))}`.replace(/\/\.$/, '');

    if (parsed.data.draft === true) continue;

    posts.push({
      slug,
      title,
      description: parsed.data.description || summaryFromMarkdown(raw) || `Notes for ${title}`,
      date: toDateString(parsed.data.date, stats.mtime),
      updated: parsed.data.updated ? toDateString(parsed.data.updated, stats.mtime) : undefined,
      author: parsed.data.author || 'Security Researcher',
      tags: asArray(parsed.data.tags),
      category: parsed.data.category || branch.name,
      collection: branch.id,
      branch: {
        id: branch.id,
        name: branch.name,
        directory: branch.directory,
        slug: branch.slug,
        route: branch.route,
      },
      subBranch: subBranch
        ? {
            id: subBranch.id,
            name: subBranch.name,
            directory: subBranch.directory,
            slug: subBranch.slug,
            route: subBranch.route,
          }
        : undefined,
      type,
      difficulty: parsed.data.difficulty || undefined,
      featured: Boolean(parsed.data.featured),
      cover: resolveContentAsset(assetBasePath, parsed.data.cover),
      sourcePath: toPosix(path.relative(rootDir, file)),
      contentPath: `/content/${publicRelativePath}`,
      assetBasePath,
      url: routeFor(branch, slug, subBranch),
      readingTime: readingTime(raw),
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        site,
        branches: contentBranches,
        posts,
      },
      null,
      2,
    )}\n`,
  );
  await fs.writeFile(rssPath, renderRss(posts));
  await fs.writeFile(sitemapPath, renderSitemap(posts));

  console.log(`Synced ${posts.length} published markdown file${posts.length === 1 ? '' : 's'}.`);
  if (shouldSyncDist && (await syncDistArtifacts())) {
    console.log('Updated dist content artifacts without rebuilding the app bundle.');
  }
}

sync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
