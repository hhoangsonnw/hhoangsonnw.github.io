import { ListTree } from 'lucide-react';

export default function TableOfContents({ headings }) {
  if (!headings?.length) return null;

  return (
    <aside className="terminal-panel sticky top-24 hidden rounded-lg p-4 lg:block">
      <div className="vault-stat-label mb-3 flex items-center gap-2 font-semibold">
        <ListTree size={15} />
        Contents
      </div>
      <nav className="space-y-1 text-sm" aria-label="Table of contents">
        {headings.map((heading) => (
          <a
            key={`${heading.id}-${heading.text}`}
            href={`#${heading.id}`}
            className={`block rounded px-2 py-1.5 text-[var(--ink-soft)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)] ${
              heading.depth === 3 ? 'ml-3 text-xs' : ''
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
