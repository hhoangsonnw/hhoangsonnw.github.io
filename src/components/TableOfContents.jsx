import { ListTree } from 'lucide-react';

export default function TableOfContents({ headings }) {
  if (!headings?.length) return null;

  return (
    <aside className="terminal-panel sticky top-24 hidden rounded-lg p-4 lg:block">
      <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase text-slate-500 dark:text-cyan-200">
        <ListTree size={15} />
        Contents
      </div>
      <nav className="space-y-1 text-sm" aria-label="Table of contents">
        {headings.map((heading) => (
          <a
            key={`${heading.id}-${heading.text}`}
            href={`#${heading.id}`}
            className={`block rounded px-2 py-1.5 text-slate-600 transition hover:bg-slate-900/5 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100 ${
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
