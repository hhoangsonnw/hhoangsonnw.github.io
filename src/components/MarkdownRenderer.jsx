import { Check, Copy } from 'lucide-react';
import { Children, isValidElement, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';
import { resolvePublicPath } from '../lib/content.js';

function isRelativeAsset(value = '') {
  return value && !/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(value);
}

function resolveAsset(value, assetBasePath) {
  if (!assetBasePath || !isRelativeAsset(value)) return value;
  return resolvePublicPath(`${assetBasePath}/${value}`.replace(/\/{2,}/g, '/'));
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function InlineCode({ children, ...props }) {
  return (
    <code
      {...props}
      className="rounded border border-slate-900/10 bg-slate-900/5 px-1.5 py-0.5 font-mono text-[0.9em] text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100"
    >
      {children}
    </code>
  );
}

function FencedCodeBlock({ className = '', code }) {
  const [copied, setCopied] = useState(false);
  const language = /language-(\w+)/.exec(className)?.[1];

  const highlighted = useMemo(() => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      return escapeHtml(code);
    }
  }, [code, language]);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-md border border-slate-900/10 bg-slate-950 text-slate-100 dark:border-cyan-400/20">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2 font-mono text-xs text-slate-300">
        <span>{language || 'text'}</span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-2 rounded border border-white/10 px-2 py-1 text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code className={className} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

function PreBlock({ children }) {
  const child = Children.toArray(children).find((item) => isValidElement(item) && item.props?.children !== undefined);

  if (!child) {
    return <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-slate-100">{children}</pre>;
  }

  return <FencedCodeBlock className={child.props.className || ''} code={String(child.props.children ?? '').replace(/\n$/, '')} />;
}

export default function MarkdownRenderer({ markdown, assetBasePath }) {
  return (
    <article className="markdown-body prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-mono prose-a:text-cyan-700 dark:prose-a:text-cyan-300 prose-strong:text-slate-950 dark:prose-strong:text-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          code: InlineCode,
          pre: PreBlock,
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-emerald-400 bg-emerald-400/10 px-4 py-2 text-slate-700 dark:text-emerald-100">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="not-prose my-6 overflow-hidden rounded-md border border-slate-900/10 dark:border-cyan-400/20">
                <table className="w-full table-fixed border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-slate-900/10 bg-slate-900/5 px-3 py-2 text-left font-semibold text-slate-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="break-words border-t border-slate-900/10 px-3 py-2 align-top dark:border-cyan-400/15">{children}</td>;
          },
          img({ src, alt }) {
            return (
              <img
                src={resolveAsset(src, assetBasePath)}
                alt={alt || ''}
                loading="lazy"
                className="rounded-lg border border-slate-900/10 shadow-glow dark:border-cyan-400/20"
              />
            );
          },
          a({ href, children }) {
            const resolvedHref = resolveAsset(href, assetBasePath);
            const external = /^(?:https?:|mailto:)/i.test(resolvedHref || '');
            return (
              <a href={resolvedHref} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
