import { Calendar, Clock, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../components/Seo.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import { extractToc, findPostBySlug, formatDate, loadManifest, loadMarkdown } from '../lib/content.js';

export default function Post({ expectedBranchSlug, expectedSubBranchSlug }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    loadManifest()
      .then((posts) => {
        const match = findPostBySlug(posts, slug, expectedBranchSlug, expectedSubBranchSlug);
        if (!match) {
          throw new Error('Post not found');
        }
        setPost(match);
        return loadMarkdown(match);
      })
      .then((content) => {
        if (!active) return;
        setMarkdown(content);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [expectedBranchSlug, expectedSubBranchSlug, slug]);

  const headings = useMemo(() => extractToc(markdown), [markdown]);
  const canonicalUrl =
    post && typeof window !== 'undefined'
      ? `${window.location.origin}${import.meta.env.BASE_URL}${post.url.replace(/^\//, '')}`
      : undefined;

  if (status === 'loading') {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="terminal-panel rounded-lg p-6 font-mono text-sm text-slate-600 dark:text-slate-300">Loading post...</div>
      </PageTransition>
    );
  }

  if (status === 'error' || !post) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Seo title="Post not found" />
        <div className="terminal-panel rounded-lg p-6">
          <h1 className="font-mono text-2xl font-bold">Post not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">The content index does not include this slug.</p>
          <Link className="mt-5 inline-flex rounded-md border border-emerald-400 px-3 py-2 font-mono text-sm text-emerald-700 dark:text-emerald-200" to="/">
            Back home
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo title={post.title} description={post.description} type="article" url={canonicalUrl} image={post.cover} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <header className="mb-8">
            <Link to={post.subBranch?.route || post.branch?.route || '/'} className="font-mono text-sm text-cyan-700 transition hover:text-cyan-500 dark:text-cyan-300">
              /{post.branch?.name || 'content'}{post.subBranch ? `/${post.subBranch.name}` : ''}
            </Link>
            <h1 className="mt-4 font-mono text-3xl font-black text-slate-950 dark:text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{post.description}</p>

            <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={14} />
                {post.readingTime?.text}
              </span>
              <span className="inline-flex items-center gap-2">
                <Terminal size={14} />
                {post.category}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(post.tags ?? []).map((tag) => (
                <span key={tag} className="tag-chip border-cyan-400/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-100">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="terminal-panel rounded-lg p-4 sm:p-6 lg:p-8">
            <MarkdownRenderer markdown={markdown} assetBasePath={post.assetBasePath} />
          </div>
        </div>

        <TableOfContents headings={headings} />
      </div>
    </PageTransition>
  );
}
