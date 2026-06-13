import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <PageTransition className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <Seo title="404" />
      <div className="terminal-panel rounded-lg p-8">
        <p className="font-mono text-sm text-cyan-700 dark:text-cyan-300">status: 404</p>
        <h1 className="mt-3 font-mono text-4xl font-black text-slate-950 dark:text-white">Route not found</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">The requested path is outside the current branch map.</p>
        <Link className="mt-6 inline-flex rounded-md border border-emerald-400 bg-emerald-400/10 px-3 py-2 font-mono text-sm text-emerald-700 dark:text-emerald-200" to="/">
          Back home
        </Link>
      </div>
    </PageTransition>
  );
}
