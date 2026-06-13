const MANIFEST_URL = `${import.meta.env.BASE_URL}content-manifest.json`;

export function resolvePublicPath(path = '') {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return encodeURI(`${base}${normalized}`);
}

export async function loadManifest() {
  const response = await fetch(`${MANIFEST_URL}?v=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Unable to load content manifest: ${response.status}`);
  }

  const manifest = await response.json();
  return manifest.posts ?? [];
}

export async function loadMarkdown(post) {
  const response = await fetch(`${resolvePublicPath(post.contentPath)}?v=${post.updated || post.date || Date.now()}`);
  if (!response.ok) {
    throw new Error(`Unable to load markdown: ${response.status}`);
  }

  return stripFrontmatter(await response.text());
}

export function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]*?---\s*/, '');
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function getAllTags(posts) {
  return Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort((a, b) => a.localeCompare(b));
}

export function findPostBySlug(posts, slug, expectedBranchSlug, expectedSubBranchSlug) {
  return posts.find((post) => {
    const branchMatches = !expectedBranchSlug || post.branch?.slug === expectedBranchSlug;
    const subBranchMatches =
      expectedSubBranchSlug === undefined ? !post.subBranch?.slug : post.subBranch?.slug === expectedSubBranchSlug;

    return post.slug === slug && branchMatches && subBranchMatches;
  });
}

export function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=[\]{};:'"\\|,.<>/?]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractToc(markdown) {
  const headingPattern = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingPattern.exec(markdown)) !== null) {
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`#]/g, '')
      .trim();

    headings.push({
      id: slugify(text),
      depth: match[1].length,
      text,
    });
  }

  return headings;
}
