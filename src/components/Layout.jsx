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
    <div className="relative min-h-screen overflow-hidden text-[var(--ink)]">
      <ParticleNetwork />
      <div className="matrix-grid pointer-events-none fixed inset-x-0 top-0 z-0 h-80 opacity-50" aria-hidden="true" />

      <header className="vault-header sticky top-0 z-30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="vault-brand uppercase">HHOANGSONNW</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {/* /impeccable harden: active and idle nav states now share tokenized classes across desktop and mobile. */}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `terminal-link ${isActive ? 'terminal-link-active' : ''}`}
              >
                /{item.label}
              </NavLink>
            ))}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="vault-icon-button"
              aria-label="GitHub profile"
              title="GitHub profile"
            >
              <Github size={17} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="vault-icon-button"
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
              className="vault-icon-button"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {isOpen ? (
          <div className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `terminal-link ${isActive ? 'terminal-link-active' : ''}`}
                >
                  /{item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="vault-muted relative z-10 mx-auto max-w-7xl px-4 py-10 text-sm sm:px-6 lg:px-8">
        <div className="border-t border-[var(--line)] pt-6 font-mono">
          <p>signal over noise | notes from the lab</p>
        </div>
      </footer>
    </div>
  );
}
