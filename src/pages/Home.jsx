import { ArrowRight, Clock, Radio, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../components/BlogList.jsx';
import GlitchText from '../components/GlitchText.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../components/Seo.jsx';
import { contentBranches } from '../lib/branches.js';
import { formatDate, loadManifest } from '../lib/content.js';

export default function Home() {
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

  const publishedPosts = useMemo(() => posts.filter((post) => post.type === 'writeup' || post.type === 'blog'), [posts]);
  const featured = useMemo(() => posts.find((post) => post.featured) ?? posts[0], [posts]);
  const branchCounts = useMemo(
    () =>
      contentBranches.reduce((counts, branch) => {
        counts[branch.id] = posts.filter((post) => post.branch?.id === branch.id).length;
        return counts;
      }, {}),
    [posts],
  );

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <Seo />

      <section className="relative min-h-[68vh] py-10 sm:py-16">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-700 dark:text-emerald-200">
            <Radio size={14} />
            online: operator portfolio
          </p>
          <GlitchText as="h1" className="font-mono text-4xl font-black text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Welcome to my vault
          </GlitchText>
          <blockquote className="mt-6 max-w-3xl border-l border-cyan-400/40 pl-5 font-mono text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            <p>"Please, step forwards. May I have the password?"</p>
            <p className="mt-2">"Fidelio."</p>
          </blockquote>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#branches"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-500 bg-emerald-400 px-4 py-3 font-mono text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              Browse branches
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="terminal-panel rounded-lg p-4">
            <div className="font-mono text-xs uppercase text-slate-500 dark:text-slate-400">indexed write-ups</div>
            <div className="mt-3 font-mono text-3xl font-bold text-slate-950 dark:text-white">{publishedPosts.length}</div>
          </div>
          <div className="terminal-panel rounded-lg p-4">
            <div className="font-mono text-xs uppercase text-slate-500 dark:text-slate-400">latest signal</div>
            <div className="mt-3 font-mono text-lg font-semibold text-slate-950 dark:text-white">
              {featured ? formatDate(featured.date) : status}
            </div>
          </div>
          <div className="terminal-panel rounded-lg p-4">
            <div className="font-mono text-xs uppercase text-slate-500 dark:text-slate-400">content branches</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {contentBranches.map((branch) => (
                <Link key={branch.id} to={branch.route} className="tag-chip border-cyan-400/30 bg-cyan-400/10 text-cyan-700 hover:border-emerald-400 dark:text-cyan-100">
                  {branch.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="branches" className="mb-12 grid gap-4 md:grid-cols-3">
        {contentBranches.map((branch) => (
          <Link key={branch.id} to={branch.route} className="terminal-panel cyber-border rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
            <div className="font-mono text-xs uppercase text-slate-500 dark:text-slate-400">{branch.name}</div>
            <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600 dark:text-slate-300">{branch.description}</p>
            <div className="mt-4 font-mono text-2xl font-bold text-slate-950 dark:text-white">{branchCounts[branch.id] || 0}</div>
          </Link>
        ))}
      </section>

      {featured ? (
        <section className="mb-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center gap-3 font-mono text-sm text-slate-500 dark:text-slate-400">
            <Terminal size={18} />
            featured transmission
          </div>
          <Link to={featured.url} className="terminal-panel cyber-border rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
              <Clock size={14} />
              {featured.readingTime?.text}
            </div>
            <h2 className="mt-3 font-mono text-2xl font-bold text-slate-950 dark:text-white">{featured.title}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{featured.description}</p>
          </Link>
        </section>
      ) : null}

      <BlogList
        posts={publishedPosts.slice(0, 6)}
        title="Recent Write-ups"
        description="Latest notes across HTB, CyberDefenders, and CTF competitions."
      />
    </PageTransition>
  );
}
