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
        <div className="terminal-panel vault-muted rounded-lg p-6 font-mono text-sm">Loading post...</div>
      </PageTransition>
    );
  }

  if (status === 'error' || !post) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Seo title="Post not found" />
        <div className="terminal-panel rounded-lg p-6">
          <h1 className="vault-title text-3xl font-bold">Post not found</h1>
          <p className="vault-muted mt-3">The content index does not include this slug.</p>
          <Link className="vault-button mt-5" to="/">
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
            <Link to={post.subBranch?.route || post.branch?.route || '/'} className="vault-link font-mono text-sm">
              /{post.branch?.name || 'content'}{post.subBranch ? `/${post.subBranch.name}` : ''}
            </Link>
            <h1 className="vault-title mt-4 text-4xl font-black sm:text-6xl">{post.title}</h1>
            <p className="vault-muted mt-4 max-w-3xl text-lg leading-8">{post.description}</p>

            <div className="vault-meta mt-5 flex flex-wrap gap-3 text-xs">
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
                <span key={tag} className="tag-chip">
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
