import { ArrowRight, Clock, Radio, Terminal, UserRound } from 'lucide-react';
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
          <p className="vault-kicker mb-5">
            <Radio size={14} />
            online: operator portfolio
          </p>
          {/* /impeccable typeset: preserve the GlitchText API, but pair it with quiet editorial display type. */}
          <GlitchText as="h1" className="vault-title text-4xl font-black sm:text-5xl lg:text-6xl">
            Welcome to my vault
          </GlitchText>
          <blockquote className="vault-quote mt-7 font-display text-lg leading-8 sm:text-xl">
            <p>"Please, step forwards. May I have the password?"</p>
            <p className="mt-2">"Fidelio."</p>
          </blockquote>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/about"
              className="vault-button-secondary focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
            >
              About Me
              <UserRound size={16} />
            </Link>
            <a
              href="#branches"
              className="vault-button focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
            >
              Browse branches
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="terminal-panel rounded-lg p-4">
            <div className="vault-stat-label">indexed write-ups</div>
            <div className="vault-stat-value mt-3 text-3xl font-bold">{publishedPosts.length}</div>
          </div>
          <div className="terminal-panel rounded-lg p-4">
            <div className="vault-stat-label">latest signal</div>
            <div className="vault-stat-value mt-3 text-lg font-semibold">
              {featured ? formatDate(featured.date) : status}
            </div>
          </div>
          <div className="terminal-panel rounded-lg p-4">
            <div className="vault-stat-label">content branches</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {contentBranches.map((branch) => (
                <Link key={branch.id} to={branch.route} className="tag-chip">
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
            <div className="vault-stat-label">{branch.name}</div>
            <p className="vault-muted mt-3 min-h-20 text-sm leading-6">{branch.description}</p>
            <div className="vault-stat-value mt-4 text-2xl font-bold">{branchCounts[branch.id] || 0}</div>
          </Link>
        ))}
      </section>

      {featured ? (
        <section className="mb-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="vault-meta flex items-center gap-3 text-sm">
            <Terminal size={18} />
            featured transmission
          </div>
          <Link to={featured.url} className="terminal-panel cyber-border rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-glow">
            <div className="vault-meta flex items-center gap-2 text-xs">
              <Clock size={14} />
              {featured.readingTime?.text}
            </div>
            <h2 className="vault-title mt-3 text-3xl font-bold">{featured.title}</h2>
            <p className="vault-muted mt-3">{featured.description}</p>
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
