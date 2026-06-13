import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isDark, onToggle }) {
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300/60 bg-white/70 text-slate-700 shadow-sm transition hover:border-cyan-400 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 dark:border-cyan-400/30 dark:bg-slate-950/70 dark:text-emerald-200 dark:hover:border-emerald-300 dark:hover:text-emerald-100"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon size={18} />
    </button>
  );
}
