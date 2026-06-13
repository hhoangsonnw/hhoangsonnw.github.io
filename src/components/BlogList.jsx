import { motion } from 'framer-motion';
import { Clock, Filter, Search, Tags } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getAllTags } from '../lib/content.js';

export default function BlogList({ posts, title = 'Write-ups', description }) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState('all');

  const tags = useMemo(() => getAllTags(posts), [posts]);
  const difficulties = useMemo(
    () => ['all', ...Array.from(new Set(posts.map((post) => post.difficulty).filter(Boolean)))],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.description, post.category, ...(post.tags ?? [])].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => post.tags?.includes(tag));
      const matchesDifficulty = difficulty === 'all' || post.difficulty === difficulty;

      return matchesQuery && matchesTags && matchesDifficulty;
    });
  }, [difficulty, posts, query, selectedTags]);

  function toggleTag(tag) {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="vault-title text-3xl font-bold">{title}</h2>
        {description ? <p className="vault-muted max-w-3xl">{description}</p> : null}
      </div>

      <div className="terminal-panel rounded-lg p-4">
        {/* /impeccable craft: form controls are still native inputs, now styled as reusable vault controls. */}
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search CTF write-ups</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search targets, exploits, tags..."
              className="vault-input pl-10 pr-3 font-mono text-sm"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Filter by difficulty</span>
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={18} />
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="vault-input pl-10 pr-8 font-mono text-sm lg:w-44"
            >
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'All levels' : item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`tag-chip ${selected ? 'tag-chip-active' : ''}`}
              >
                <Tags size={13} />
                <span className="ml-1">#{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredPosts.map((post, index) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.24, delay: Math.min(index * 0.03, 0.18) }}
            className="terminal-panel cyber-border rounded-lg p-5"
          >
            <Link to={post.url} className="group block space-y-4">
              <div className="vault-meta flex flex-wrap items-center gap-2 text-xs">
                <span>{formatDate(post.date)}</span>
                <span aria-hidden="true">/</span>
                <span>{post.category}</span>
                {post.difficulty ? (
                  <>
                    <span aria-hidden="true">/</span>
                    <span>{post.difficulty}</span>
                  </>
                ) : null}
              </div>
              <div>
                <h3 className="vault-title text-2xl font-semibold transition group-hover:text-[var(--accent-strong)]">
                  {post.title}
                </h3>
                <p className="vault-muted mt-2 line-clamp-3 text-sm leading-6">{post.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).map((tag) => (
                  <span key={tag} className="tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="vault-meta flex items-center gap-2 text-xs">
                <Clock size={14} />
                <span>{post.readingTime?.text ?? '3 min read'}</span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="terminal-panel vault-muted rounded-lg p-6 font-mono text-sm">
          No matching write-ups in the current index.
        </div>
      ) : null}
    </section>
  );
}
