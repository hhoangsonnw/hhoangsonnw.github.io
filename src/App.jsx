import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { contentBranches } from './lib/branches.js';

const BranchPage = lazy(() => import('./pages/BranchPage.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Post = lazy(() => import('./pages/Post.jsx'));

function RouteFallback() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="terminal-panel vault-muted rounded-lg p-6 font-mono text-sm">Loading route...</div>
    </main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            {contentBranches.map((branch) => (
              <Route key={branch.id} path={branch.slug} element={<BranchPage branchSlug={branch.slug} />} />
            ))}
            {contentBranches.flatMap((branch) =>
              (branch.subBranches ?? []).map((subBranch) => (
                <Route
                  key={subBranch.id}
                  path={`${branch.slug}/${subBranch.slug}`}
                  element={<BranchPage branchSlug={branch.slug} subBranchSlug={subBranch.slug} />}
                />
              )),
            )}
            {contentBranches.flatMap((branch) =>
              (branch.subBranches ?? []).map((subBranch) => (
                <Route
                  key={`${subBranch.id}-post`}
                  path={`${branch.slug}/${subBranch.slug}/:slug`}
                  element={<Post expectedBranchSlug={branch.slug} expectedSubBranchSlug={subBranch.slug} />}
                />
              )),
            )}
            {contentBranches.map((branch) => (
              <Route key={`${branch.id}-post`} path={`${branch.slug}/:slug`} element={<Post expectedBranchSlug={branch.slug} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}
