import { Link, NavLink } from 'react-router-dom';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { contentBranches } from '../lib/branches.js';
import ParticleNetwork from './ParticleNetwork.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const navItems = contentBranches.map((branch) => ({
  to: branch.route,
  label: branch.name,
}));

export default function Layout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const githubUrl = import.meta.env.VITE_GITHUB_URL || 'https://github.com/hhoangsonnw';
  const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/hoang-son-bui-81417b317/';

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 dark:text-emerald-50">
      <ParticleNetwork />
      <div className="matrix-grid pointer-events-none fixed inset-x-0 top-0 z-0 h-80 opacity-50" aria-hidden="true" />

      <header className="sticky top-0 z-30 border-b border-slate-900/10 bg-slate-50/78 backdrop-blur-xl dark:border-cyan-400/15 dark:bg-slate-950/72">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="font-mono text-base font-semibold uppercase text-slate-800 dark:text-emerald-100">
              HHOANGSONNW
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `terminal-link ${
                    isActive
                      ? 'border border-emerald-400/50 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200'
                      : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100'
                  }`
                }
              >
                /{item.label}
              </NavLink>
            ))}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300/60 bg-white/70 text-slate-700 transition hover:border-slate-900 hover:text-slate-950 dark:border-cyan-400/30 dark:bg-slate-950/70 dark:text-emerald-200 dark:hover:border-emerald-300"
              aria-label="GitHub profile"
              title="GitHub profile"
            >
              <Github size={17} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300/60 bg-white/70 text-slate-700 transition hover:border-sky-500 hover:text-sky-700 dark:border-cyan-400/30 dark:bg-slate-950/70 dark:text-emerald-200 dark:hover:border-sky-300 dark:hover:text-sky-200"
              aria-label="LinkedIn profile"
              title="LinkedIn profile"
            >
              <Linkedin size={17} />
            </a>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300/70 bg-white/70 text-slate-700 transition dark:border-cyan-400/30 dark:bg-slate-950/70 dark:text-emerald-200"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {isOpen ? (
          <div className="border-t border-slate-900/10 bg-slate-50/94 px-4 py-3 backdrop-blur-xl dark:border-cyan-400/15 dark:bg-slate-950/94 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `terminal-link ${
                      isActive
                        ? 'border border-emerald-400/50 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200'
                        : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100'
                    }`
                  }
                >
                  /{item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
        <div className="border-t border-slate-900/10 pt-6 font-mono dark:border-cyan-400/15">
          <p>signal over noise | notes from the lab</p>
        </div>
      </footer>
    </div>
  );
}
