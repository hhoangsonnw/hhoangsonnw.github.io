import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../components/BlogList.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../components/Seo.jsx';
import { getBranchBySlug, getSubBranchBySlug } from '../lib/branches.js';
import { loadManifest } from '../lib/content.js';

export default function BranchPage({ branchSlug, subBranchSlug }) {
  const branch = getBranchBySlug(branchSlug);
  const subBranch = subBranchSlug ? getSubBranchBySlug(branchSlug, subBranchSlug) : undefined;
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    loadManifest()
      .then((items) => {
        setPosts(items);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const pageTitle = subBranch?.name || branch?.name;
  const pageDescription = subBranch?.description || branch?.description;
  const branchPosts = useMemo(
    () =>
      posts.filter((post) => {
        const branchMatches = post.branch?.slug === branchSlug;
        const subBranchMatches = subBranchSlug ? post.subBranch?.slug === subBranchSlug : true;
        return branchMatches && subBranchMatches;
      }),
    [branchSlug, posts, subBranchSlug],
  );

  if (!branch || (subBranchSlug && !subBranch)) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Seo title="Branch not found" />
        <div className="terminal-panel vault-muted rounded-lg p-6 font-mono text-sm">Branch not found.</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo title={pageTitle} description={pageDescription} />

      {!subBranchSlug && branch.subBranches?.length ? (
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          {branch.subBranches.map((item) => (
            <Link key={item.id} to={item.route} className="terminal-panel cyber-border rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
              <div className="vault-title text-2xl font-bold">{item.name}</div>
              <p className="vault-muted mt-3 text-sm leading-6">{item.description}</p>
              <div className="vault-meta mt-4 text-xs">{posts.filter((post) => post.subBranch?.slug === item.slug).length} entries</div>
            </Link>
          ))}
        </section>
      ) : null}

      {status === 'loading' ? (
        <div className="terminal-panel vault-muted rounded-lg p-6 font-mono text-sm">Loading {pageTitle} content...</div>
      ) : null}

      {status === 'error' ? (
        <div className="terminal-panel rounded-lg border-[var(--seal)] p-6 font-mono text-sm text-[var(--seal)]">
          Content manifest is unavailable. Run npm run content:sync.
        </div>
      ) : null}

      {status === 'ready' ? <BlogList posts={branchPosts} title={pageTitle} description={pageDescription} /> : null}
    </PageTransition>
  );
}
