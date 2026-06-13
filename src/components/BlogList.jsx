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
        <h2 className="font-mono text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
        {description ? <p className="max-w-3xl text-slate-600 dark:text-slate-300">{description}</p> : null}
      </div>

      <div className="terminal-panel rounded-lg p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="sr-only">Search CTF write-ups</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search targets, exploits, tags..."
              className="h-11 w-full rounded-md border border-slate-300/80 bg-white/80 pl-10 pr-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 dark:border-cyan-400/25 dark:bg-slate-950/80 dark:text-emerald-50 dark:placeholder:text-slate-500"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Filter by difficulty</span>
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300/80 bg-white/80 pl-10 pr-8 font-mono text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 dark:border-cyan-400/25 dark:bg-slate-950/80 dark:text-emerald-50 lg:w-44"
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
                className={`tag-chip ${
                  selected
                    ? 'border-emerald-400 bg-emerald-400/15 text-emerald-700 dark:text-emerald-200'
                    : 'border-slate-300/80 bg-white/70 text-slate-600 hover:border-cyan-400 hover:text-cyan-700 dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:text-cyan-100'
                }`}
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
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
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
                <h3 className="font-mono text-xl font-semibold text-slate-950 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-200">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).map((tag) => (
                  <span key={tag} className="tag-chip border-slate-300/80 bg-slate-50/70 text-slate-600 dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                <Clock size={14} />
                <span>{post.readingTime?.text ?? '3 min read'}</span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="terminal-panel rounded-lg p-6 font-mono text-sm text-slate-600 dark:text-slate-300">
          No matching write-ups in the current index.
        </div>
      ) : null}
    </section>
  );
}
