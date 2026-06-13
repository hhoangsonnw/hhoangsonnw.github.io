import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <PageTransition className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <Seo title="404" />
      <div className="terminal-panel rounded-lg p-8">
        <p className="vault-meta text-sm">status: 404</p>
        <h1 className="vault-title mt-3 text-4xl font-black">Route not found</h1>
        <p className="vault-muted mt-4">The requested path is outside the current branch map.</p>
        <Link className="vault-button mt-6" to="/">
          Back home
        </Link>
      </div>
    </PageTransition>
  );
}
