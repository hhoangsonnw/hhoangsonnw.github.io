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
    <code {...props} className="font-mono text-[0.9em]">
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
    <div className="vault-code not-prose my-6">
      <div className="vault-code-header">
        <span>{language || 'text'}</span>
        <button
          type="button"
          onClick={copyCode}
          className="vault-code-button focus:outline-none focus:ring-2 focus:ring-[var(--amber-soft)]"
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
    return <pre className="vault-code overflow-x-auto p-4">{children}</pre>;
  }

  return <FencedCodeBlock className={child.props.className || ''} code={String(child.props.children ?? '').replace(/\n$/, '')} />;
}

export default function MarkdownRenderer({ markdown, assetBasePath }) {
  return (
    <article className="markdown-body prose max-w-none prose-headings:scroll-mt-24 prose-headings:font-display prose-a:text-[var(--accent-strong)] prose-strong:text-[var(--ink)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          code: InlineCode,
          pre: PreBlock,
          blockquote({ children }) {
            // /impeccable critique: replace the stock side-tab quote block with a sealed note panel.
            return (
              <blockquote className="vault-quote my-6 text-base leading-7">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="vault-table-frame not-prose my-6">
                <table className="w-full table-fixed border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-left font-semibold text-[var(--ink)]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="break-words border-t border-[var(--line)] px-3 py-2 align-top">{children}</td>;
          },
          img({ src, alt }) {
            return (
              <img
                src={resolveAsset(src, assetBasePath)}
                alt={alt || ''}
                loading="lazy"
                className="rounded-lg border border-[var(--line)] shadow-glow"
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
